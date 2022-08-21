
import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { Place } from "./pn-place";
import { PnSubnet } from "./pn-subnet";
import { Transition } from "./pn-transition";

/**
 * Each AndJoin path in BPMN graph is represented by a place in petri net;
 * all places are connected to one following transition
 */
export class MultiPlaceOneTransPnSubnet extends PnSubnet {

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        this.addTransition(new Transition(bpmnNode.id, bpmnNode.label))

        //create as many places as there are incoming edges
        //connect every place with the only transition
        while (this.places.length != bpmnNode.inEdges.length) {
            let place = this.addPlace(Place.create({ startPlace: false }));
            this.addArc(Arc.create(place, this.transitions[0]))
        }

    }



    get transitionsToConnectToNextSubnet(): Array<Transition> {
        let transitions = new Array<Transition>()
        let trans = this.transitions[0]
        if (trans)
            transitions.push(trans)
        return transitions
    }

    /**
     * find one of the input places that is not connected to preceding PN-Subnet yet
     */
    get placeToConnectToPreviousSubnet(): Place | undefined {
        return this.places.find(place => !place.isConnected());
    }

}