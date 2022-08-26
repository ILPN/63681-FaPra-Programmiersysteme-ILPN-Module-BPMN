import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { Place } from "./pn-place";
import { PnSubnet } from "./pn-subnet";
import { Transition } from "./pn-transition";

/**
 * Each XorSplit path in BPMN graph is represented by a transition in petri net;
 * all transitions are connected to one preceding place
 */
export class OnePlaceMultiTransitionsPnSubnet extends PnSubnet {


    _inputPlace: Place

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        this._inputPlace = this.addPlace(Place.create({ startPlace: false }))

        //for adding index to the label of each transition
        let counter: number = 1;


        //create as many transitions as there are outgoing edges
        //connect the only one incoming place to all the transitions
        while (this.transitions.length != bpmnNode.outEdges.length) {
            let trans = this.addTransition(new Transition(bpmnNode.id, bpmnNode.label, counter++));

            this.addArc(Arc.create(this._inputPlace, trans))
        }

    }

    get transitionsToConnectToNextSubnet(): Array<Transition> {
        let transitions = new Array<Transition>()
        let notConnected = this.findNotConnectedTransition()
        if (notConnected)
            transitions.push(notConnected)
        return transitions
    }
    
    get placeToConnectToPreviousSubnet(): Place | undefined {
       return this._inputPlace
    }


}