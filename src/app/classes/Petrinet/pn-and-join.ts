
import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { Place } from "./place";
import { PnSubnet } from "./pn-subnet";

/**
 * Each AndJoin path in BPMN graph is represented by a place in petri net;
 * all places are connected to one following transition
 */
export class PnAndJoin extends PnSubnet {
    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        //create as many places as there are incoming edges
        //connect every place with the only transition
        while (this.places.length != bpmnNode.inEdges.length) {
            let place = this.addPlace(Place.create());
            this.addArc(Arc.create(place, this.transitions[0]))
        }
       
    }

    /**
     * find one of the input places that is not connected to preceding PN-Subnet yet
     */
    override get inputPlace(): Place | undefined{
       return this.findNotConnectedInputPlace();
    }


}