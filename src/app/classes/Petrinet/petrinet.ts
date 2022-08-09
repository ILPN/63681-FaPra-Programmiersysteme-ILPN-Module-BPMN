import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { Arc } from "./arc";
import { Place } from "./place";
import { PlaceCounter } from "./place-counter";
import { PnAndJoin } from "./pn-and-join";
import { PnEndEvent } from "./pn-endevent";
import { PnOrJoin } from "./pn-or-join";
import { PnOrSplit } from "./pn-or-split";
import { PnStartEvent } from "./pn-startevent";
import { PnSubnet } from "./pn-subnet";
import { PnUtils } from "./pn-utils";
import { PnXorJoin } from "./pn-xor-join";
import { PnXorSplit } from "./pn-xor-split";
import { Transition } from "./transition";

/**
 * petri net converted from BPMN graph
 */
export class Petrinet {

    bpmnPetriMap: Map<BpmnNode, PnSubnet>
    valid: boolean = true
    errors: string = ""

    constructor(bpmnNodes: Array<BpmnNode>) {
        this.bpmnPetriMap = new Map<BpmnNode, PnSubnet>()

        //for adding index to places
        PlaceCounter.reset()

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
    }

    private convert(filter: (nodes: Array<BpmnNode>) => Array<BpmnNode>, bpmnNodes: Array<BpmnNode>) {
        let filteredNodes = filter(bpmnNodes);
        filteredNodes.forEach(node => this.addSubnetForEachOutgoingConnection(node))
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

    print(): { pnText: string, errors: string, valid: boolean } {
        let text: string = ""

        if (this.valid) {
            text += ".type pn\n";
            text += this.printTransitions();
            text += this.printPlaces()
            text += this.printArcs();
        }

        return { pnText: text, errors: this.errors, valid: this.valid };
    }

    private printTransitions(): string {
        let text: string = ".transitions\n";

        this.collectTransitions().forEach(trans => text += trans.print() + "\n")
        return text;
    }

    private printArcs(): string {
        let text: string = ".arcs\n";
        this.collectArcs().forEach(arc => text += arc.print() + "\n")

        return text;
    }

    private printPlaces(): string {
        let text: string = ".places\n";
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
    private addSubnetForEachOutgoingConnection(bpmnNode: BpmnNode): void {
        let before: PnSubnet = this.add(bpmnNode);

        bpmnNode.outEdges.forEach(outEdge => {
            let after: PnSubnet = this.add(outEdge.to);
            this.connectSubnets(before, after);
        })

    }

    private connectSubnets(before: PnSubnet, after: PnSubnet): void {
        
        let result = before.addArcTo(after.inputPlace!);//null-verification caught in result
        if (result.ok)
            after.inputPlace!.setConnected()
        else {
            let errors = " Fehler beim Verbinden von " + before.id + " zu " + after.id + ". " + result.error
            this.setErrorStatus(errors)
        }

    }

    private setErrorStatus(errors: string) {
        this.valid = false
        this.errors += errors
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
            return new PnXorSplit(bpmnNode);

        if (BpmnUtils.isJoinXor(bpmnNode))
            return new PnXorJoin(bpmnNode);

        if (BpmnUtils.isEndEvent(bpmnNode))
            return new PnEndEvent(bpmnNode);

        if (BpmnUtils.isStartEvent(bpmnNode))
            return new PnStartEvent(bpmnNode);

        if (BpmnUtils.isJoinAnd(bpmnNode))
            return new PnAndJoin(bpmnNode);

        if (BpmnUtils.isJoinOr(bpmnNode))
            return new PnOrJoin(bpmnNode);

        if (BpmnUtils.isSplitOr(bpmnNode))
            return new PnOrSplit(bpmnNode);

        return new PnSubnet(bpmnNode)
    }


}



