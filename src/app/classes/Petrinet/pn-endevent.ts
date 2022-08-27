import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { Place } from "./pn-place";
import { PnPlaceTransitionSubnet } from "./pn-oneplace-onetrans-subnet";
import { Transition } from "./pn-transition";

/**
 * BPMN end event is represented by a combination of place-transition-place in petri net
 */
export class PnEndEvent extends PnPlaceTransitionSubnet {
  

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);


        //final place in petri net
        let endPlace: Place = this.addPlace(Place.create({ startPlace: false }))
        this.addArc(Arc.create(this.transitions[0], endPlace))

    }

}