import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { CombiTransition } from "./combi-transition";
import { Place } from "./place";
import { PnElement } from "./pn-element";
import { PnOrGateway } from "./pn-or-gateway";
import { PnUtils } from "./pn-utils";
import { Transition } from "./transition";

/**
 * to convert OrJoin in BPMN graph all paths and their combinations 
 * have to be represented in petri net as place+transition 
 */
export class PnOrJoin extends PnOrGateway {

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        //for adding index to the label of each transition
        let counter: number = 1;

        //one transition already exists (inherited from constructor in parent class)
        this.transitions[0].addCounterToLabelAndId(counter++);

        //create as many transitions as there are incoming edges
        //for every transition - add incoming place
        while (this.transitions.length < bpmnNode.inEdges.length) {
            let trans = this.addTransition(new Transition(bpmnNode.id, bpmnNode.label, counter++));
            let inPlace = this.addInputPlace();
            this.addArc(Arc.create(inPlace, trans))
        }

        //create transitions representing combinations of paths
        let combinationsOfIds: string[][] = PnUtils.getCombinationsOfIds(PnUtils.getIds(this.simpleTransitions))
        for (let combinationOfIds of combinationsOfIds) {

            let combiTrans = new CombiTransition(bpmnNode.id, bpmnNode.label,
                this.getTransitionsByIds(combinationOfIds));
            this.addTransition(combiTrans);

            for (let transId of combinationOfIds) {
                let trans = this.getTransitionById(transId)!;
                let inPlace = this.getInputPlace(trans)!;
                this.addArc(Arc.create(inPlace, combiTrans))
            }

        }

    }

    private getInputPlace(trans: Transition): PnElement | undefined {
        for (let arc of this.arcs)
            if (arc.to === trans)
                return arc.from
        return undefined;
    }
    /**
     * find one of the input places that is not connected to preceding PN-Subnet yet
    */
    override get inputPlace(): Place | undefined {
        return this.findNotConnectedInputPlace();
    }

    override addArcTo(to: PnElement) :{ error: string, ok: boolean }{
        for (let transition of this.transitions) {
            let arc: Arc = Arc.create(transition, to)
            if(!arc.valid)
              return { error: arc.errors, ok: false }
            this.addArc(arc)
        }

        return { error: "", ok: true }

    }


}