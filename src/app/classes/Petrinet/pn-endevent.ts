import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { Place } from "./place";
import { PnSubnet } from "./pn-subnet";

/**
 * BPMN end event is represented by a combination of place-transition-place in petri net
 */
export class PnEndEvent extends PnSubnet {

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);
        this.addEndPlace()
    }

    //final place in petri net
    addEndPlace(): void {
        let endPlace: Place = this.addPlace(Place.create())
        this.addArc(Arc.create(this.transitions[0], endPlace))
    }

}