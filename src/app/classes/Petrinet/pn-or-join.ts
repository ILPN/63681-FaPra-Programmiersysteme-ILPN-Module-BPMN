import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { CombiTransition } from "./pn-combi-transition";
import { PnElement } from "./pn-element";
import { MultiPlaceMultiTransitionPnSubnet } from "./pn-multiplace-multitransition";
import { Transition } from "./pn-transition";
import { PnUtils } from "./pn-utils";

/**
 * to convert OrJoin in BPMN graph all paths and their combinations 
 * have to be represented in petri net as place+transition 
 */
export class PnOrJoin extends MultiPlaceMultiTransitionPnSubnet {

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        //create transitions representing combinations of paths
        let combinationsOfIds: string[][] = PnUtils.getCombinationsOfIds(PnUtils.getIds(this.transitions))
        for (let combinationOfIds of combinationsOfIds) {

            let combiTrans = new CombiTransition(bpmnNode.id, bpmnNode.label,
                this.getTransitionsByIds(combinationOfIds));
            this.addTransition(combiTrans);

            for (let transId of combinationOfIds) {
                let trans = this.getTransitionById(transId);

                let inPlace = this.getPlaceBeforeTransition(trans);
                this.addArc(Arc.create(inPlace, combiTrans))
            }
        }
    }

    private getPlaceBeforeTransition(trans: Transition | undefined): PnElement | undefined {
        if (!trans)
            return undefined
        for (let arc of this.arcs)
            if (arc.valid() && arc.to === trans)
                return arc.from
        return undefined;
    }


}