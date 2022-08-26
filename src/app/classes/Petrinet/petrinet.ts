import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { Arc } from "./arc";
import { PlaceCounter } from "./place-counter";
import { PnEndEvent } from "./pn-endevent";
import { MultiPlaceMultiTransitionPnSubnet } from "./pn-multiplace-multitransition";
import { MultiPlaceOneTransPnSubnet } from "./pn-multiplace-onetrans-subnet";
import { OnePlaceMultiTransitionsPnSubnet } from "./pn-oneplace-multitrans-subnet";
import { PnPlaceTransitionSubnet } from "./pn-oneplace-onetrans-subnet";
import { PnOrJoin } from "./pn-or-join";
import { PnOrSplit } from "./pn-or-split";
import { Place } from "./pn-place";
import { PnStartEvent } from "./pn-startevent";
import { PnSubnet } from "./pn-subnet";
import { Transition } from "./pn-transition";
import { PnUtils } from "./pn-utils";

/**
 * petri net converted from BPMN graph
 */
export class Petrinet {

    bpmnPetriMap: Map<BpmnNode, PnSubnet>
    errors: string = ""
    startPlace: Place

    constructor(bpmnNodes: Array<BpmnNode>) {

        this.bpmnPetriMap = new Map<BpmnNode, PnSubnet>()

        //for adding index to places
        PlaceCounter.reset()
        this.startPlace = Place.create({ startPlace: true })

        try {
            //in principle, nodes can be processed in any order;
            //we process them in specific order to make indexing of the corresponding places more transparent 
            this.convert(BpmnUtils.getStartEvents, bpmnNodes)
            this.convert(BpmnUtils.getTasks, bpmnNodes)
            this.convert(BpmnUtils.getGateways, bpmnNodes)
            this.convert(BpmnUtils.getIntermedEvents, bpmnNodes)
            this.convert(BpmnUtils.getEndEvents, bpmnNodes)

            // OR-Split-Transitions and OR-join-Transitions need to be connected by a direct arc with a place inbetween
            //since nodes can be in principle processed in any order,
            //we can only be sure to have all necessary transitions after every BPMN node has been converted
            this.connectEachOrSplitWithOrJoin()

        } catch (err) {
            this.errors += (err as Error).message;
        }
    }


    private convert(filter: (nodes: Array<BpmnNode>) => Array<BpmnNode>, bpmnNodes: Array<BpmnNode>) {
        let filteredNodes = filter(bpmnNodes);
        filteredNodes.forEach(node => this.createSubnetAndConnectToSuccessors(node))
    }

    // OR-Split-Transitions and OR-join-Transitions need to be connected by a direct arc with a place inbetween
    private connectEachOrSplitWithOrJoin(): void {
        let splitJoinOrMap = PnUtils.getMatchingOrGateways(this.bpmnNodes)

        splitJoinOrMap.forEach((join, split) => {
            let pnOrSplit = this.bpmnPetriMap.get(split) as PnOrSplit
            let pnOrJoin = this.bpmnPetriMap.get(join) as PnOrJoin
            pnOrSplit.connectToOrJoin(pnOrJoin)
        });

    }

    get bpmnNodes(): Array<BpmnNode> {
        return Array.from(this.bpmnPetriMap.keys());
    }

    get pnSubnets(): Array<PnSubnet> {
        return Array.from(this.bpmnPetriMap.values())
    }

    print(): { pnText: string, errors: string } {
        //graph initially empty
        if (this.bpmnNodes.length === 0)
            return { pnText: "", errors: "Graph hat keine Knoten" };

        //problem in conversion
        if (this.pnSubnets.length === 0)
            return { pnText: "", errors: this.errors };

        //at least something was converted
        let text: string = ""

        text += ".type pn\n";
        text += this.printTransitions();
        text += this.printPlaces()
        text += this.printArcs();


        return { pnText: text, errors: this.errors };
    }

    private printTransitions(): string {
        let text: string = ".transitions\n";

        this.collectTransitions().forEach(trans => text += trans.print() + "\n")
        return text;
    }

    private printArcs(): string {
        let text: string = ".arcs\n";
        this.collectArcs().forEach(arc => {
            this.errors += arc.errors
            text += arc.print() + "\n"
        })

        return text;
    }

    private printPlaces(): string {
        let text: string = ".places\n";
        text += this.startPlace.print() + "\n"
        this.collectPlaces().forEach(place => text += place.print() + "\n")

        return text;
    }

    private collectPlaces(): Array<Place> {
        let places: Array<Place> = new Array<Place>()
        for (let subnet of this.pnSubnets)
            places.push(...subnet.places)

        return places
    }

    private collectArcs(): Array<Arc> {
        let arcs: Array<Arc> = new Array<Arc>()
        for (let subnet of this.pnSubnets)
            arcs.push(...subnet.arcs)
        return arcs
    }

    private collectTransitions(): Array<Transition> {
        let transitions: Array<Transition> = new Array<Transition>()
        for (let subnet of this.pnSubnets)
            transitions.push(...subnet.transitions)
        return transitions
    }


    //each BPMN element is represented by PnSubnet - a collection of places and transitions
    //connect the subnet for the specified BPMN node with the subnets of the outgoing connections
    private createSubnetAndConnectToSuccessors(bpmnNode: BpmnNode): PnSubnet {
        let before: PnSubnet = this.add(bpmnNode);

        bpmnNode.outEdges.forEach(outEdge => {
            let after: PnSubnet = this.add(outEdge.to);
            this.connectSubnets(before, after);
        })

        return before

    }

    private connectSubnets(subnetFrom: PnSubnet, subnetTo: PnSubnet): void {
        //subnet from provides transition(s) to connect to the succeeding subnet
        let transitionsFrom = subnetFrom.transitionsToConnectToNextSubnet
        if (!transitionsFrom)
            this.errors += "Element " + subnetFrom.label + " has no transition to connect to the next element "
                + subnetTo.label

        //target subnet provides input place to connect the predecessor to
        let placeTo = subnetTo.placeToConnectToPreviousSubnet
        if (!placeTo)
            this.errors += "Element " + subnetTo.label + " has no place to connect to the preceding element "
                + subnetFrom.label

        //connect
        transitionsFrom.forEach(
            trans => {
                if (transitionsFrom && placeTo) {
                    subnetFrom.addArc(Arc.create(trans, placeTo))
                    trans.setConnected()
                    placeTo.setConnected()
                }
            }
        )

    }



    private add(bpmnNode: BpmnNode): PnSubnet {
        let subnet = this.pnSubnets.find(subnet => subnet.id === bpmnNode.id)
        if (subnet === undefined) {
            subnet = this.createPnSubnet(bpmnNode)
            this.bpmnPetriMap.set(bpmnNode, subnet);
        }
        return subnet;
    }

    private createPnSubnet(bpmnNode: BpmnNode): PnSubnet {
        if (BpmnUtils.isSplitXor(bpmnNode))
            return new OnePlaceMultiTransitionsPnSubnet(bpmnNode);

        if (BpmnUtils.isSplitOr(bpmnNode))
            return new PnOrSplit(bpmnNode);

        if (BpmnUtils.isEndEvent(bpmnNode))
            return new PnEndEvent(bpmnNode);

        if (BpmnUtils.isStartEvent(bpmnNode))
            return new PnStartEvent(bpmnNode, this.startPlace);

        if (BpmnUtils.isJoinXor(bpmnNode))
            return new MultiPlaceMultiTransitionPnSubnet(bpmnNode);

        if (BpmnUtils.isJoinAnd(bpmnNode))
            return new MultiPlaceOneTransPnSubnet(bpmnNode);

        if (BpmnUtils.isJoinOr(bpmnNode))
            return new PnOrJoin(bpmnNode);


        return new PnPlaceTransitionSubnet(bpmnNode)
    }

}



