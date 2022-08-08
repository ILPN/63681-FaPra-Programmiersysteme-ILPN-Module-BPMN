import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Place } from "./place";
import { PnSubnet } from "./pn-subnet";

/**
 * BPMN start event is represented by a combination of place-transition-place in petri net
 */
export class PnStartEvent extends PnSubnet {

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);
        

    }
    override addInputPlace(): Place {
       return this.addPlace(Place.create({ isStartPlace: true }));
    }

}