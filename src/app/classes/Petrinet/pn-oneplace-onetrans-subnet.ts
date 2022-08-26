import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { Place } from "./pn-place";
import { PnSubnet } from "./pn-subnet";
import { Transition } from "./pn-transition";

/**
 * combination of one place and one transition to represent certain BPMN elements (tasks)
 */
export class PnPlaceTransitionSubnet extends PnSubnet {

    _inputPlace: Place

    constructor(bpmnNode: BpmnNode) {

        super(bpmnNode)


        let transition = this.addTransition(new Transition(bpmnNode.id, bpmnNode.label))

        this._inputPlace = this.addPlace(Place.create({ startPlace: false }))
        let arc = Arc.create(this._inputPlace, transition);
        this.addArc(arc);

    }

    get transitionsToConnectToNextSubnet(): Array<Transition> {
        let transitions = new Array<Transition>()
        let trans = this.transitions[0]
        if (trans)
            transitions.push(trans)
        return transitions
    }

    get placeToConnectToPreviousSubnet(): Place | undefined {
        return this._inputPlace
    }

}