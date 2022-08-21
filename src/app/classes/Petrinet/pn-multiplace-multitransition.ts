import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { Place } from "./pn-place";
import { PnElement } from "./pn-element";
import { PnSubnet } from "./pn-subnet";
import { Transition } from "./pn-transition";

/**
 * Each XorJoin path in BPMN graph is represented by a combination of place+transition in petri net
 */
export class MultiPlaceMultiTransitionPnSubnet extends PnSubnet {

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        //for adding index to the label of each transition
        let counter: number = 1;

        //create as many transitions as there are incoming edges
        //for every transition - add incoming place
        while (this.transitions.length != bpmnNode.inEdges.length) {
            let trans = this.addTransition(new Transition(bpmnNode.id, bpmnNode.label, counter++))
            let inPlace = this.addPlace(Place.create({ startPlace: false }))
            this.addArc(Arc.create(inPlace, trans))
        }
    }

    get transitionsToConnectToNextSubnet(): Array<Transition> {
        return this.transitions
    }


    get placeToConnectToPreviousSubnet(): Place | undefined {
        return this.findNotConnectedPlace()
    }




}