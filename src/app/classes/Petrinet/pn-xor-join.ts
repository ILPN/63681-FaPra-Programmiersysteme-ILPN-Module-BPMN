import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { Place } from "./place";
import { PnElement } from "./pn-element";
import { PnSubnet } from "./pn-subnet";
import { Transition } from "./transition";

/**
 * Each XorJoin path in BPMN graph is represented by a combination of place+transition in petri net
 */
export class PnXorJoin extends PnSubnet {
    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        //for adding index to the label of each transition
        let counter: number = 1;

        //one transition already exists
        this.transitions[0].addCounterToLabelAndId(counter++);

        //create as many transitions as there are incoming edges
        //for every transition - add incoming place
        while (this.transitions.length != bpmnNode.inEdges.length) {
            let trans = this.addTransition(new Transition(bpmnNode.id, bpmnNode.label, counter++))
            let inPlace = this.addInputPlace();
            this.addArc(Arc.create(inPlace, trans))
        }
    }

    /**
     * find one of the input places that is not connected to preceding PN-Subnet yet
     */
    override get inputPlace(): Place | undefined {
        return this.findNotConnectedInputPlace();
    }

    override addArcTo(to: PnElement): { error: string, ok: boolean } {
        for (let transition of this.transitions) {
            let arc: Arc = Arc.create(transition, to)
            if (!arc.valid)
                return { error: arc.errors, ok: false }
            this.addArc(arc)
        }
        return { error: "", ok: true }

    }


}