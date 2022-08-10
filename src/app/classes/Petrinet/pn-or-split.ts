import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { CombiTransition } from "./combi-transition";
import { Place } from "./place";
import { PnElement } from "./pn-element";
import { PnOrGateway } from "./pn-or-gateway";
import { PnOrJoin } from "./pn-or-join";
import { PnUtils } from "./pn-utils";
import { Transition } from "./transition";

/**
 * to convert OrSplit in BPMN graph all paths and their combinations 
 * have to be represented in petri net as transitions connected to one preceding place 
 */
export class PnOrSplit extends PnOrGateway {

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        //for adding index to the label of each transition
        let counter: number = 1;

        //one transition already exists
        this.transitions[0].addCounterToLabelAndId(counter++);

        //create as many transitions as there are outgoing edges
        //connect the only one incoming place to all the transitions
        while (this.transitions.length < bpmnNode.outEdges.length) {
            let trans = this.addTransition(new Transition(bpmnNode.id, bpmnNode.label, counter++));
            this.addArc(Arc.create(this.inputPlace!, trans))
        }

        //create transitions representing combinations of paths
        let combinationsOfIds: string[][] = PnUtils.getCombinationsOfIds(PnUtils.getIds(this.simpleTransitions))
        for (let combinationOfIds of combinationsOfIds) {
            let combiTrans = new CombiTransition(bpmnNode.id, bpmnNode.label,
                this.getTransitionsByIds(combinationOfIds));

            this.addTransition(combiTrans)
            this.addArc(Arc.create(this.inputPlace!, combiTrans))

        }

    }

    /**
     * create place between split-Or and join-Or
     * @param orJoin 
     */
    connectToOrJoin(orJoin: PnOrJoin): void {
        let pairs = PnUtils.getMatchingOrSplitJoinTransitions(this.simpleTransitions, orJoin.simpleTransitions)

        pairs.forEach((join, split) => {
            let place = Place.create();
            this.addPlace(place)
            this.addArc(Arc.create(split, place));
            orJoin.addArc(Arc.create(place, join))

        })
    }

    override addArcTo(to: PnElement): { error: string, ok: boolean } {
        let transition: Transition = this.findNotConnectedTransition()!;
        let arc: Arc = Arc.create(transition, to);
        if (!arc.valid)
            return { error: arc.errors, ok: false }
        transition.setConnected();
        this.addArc(arc);

        //connect every combiTransition that contains 
        //the id of the previously connected transition in its corresponding combination list
        let combis: Array<Transition> = this.findCombiTransitionsContainingId(transition.id);

        for (let combi of combis) {
            let arc: Arc = Arc.create(combi, to);
            if (!arc.valid)
                return { error: arc.errors, ok: false }
            this.addArc(arc);
        }

        return { error: "", ok: true }

    }

    //transitions representing combinations of paths contain references to simple transitions 
    //representing these paths
    findCombiTransitionsContainingId(simpleTransId: string): Array<CombiTransition> {
        return this.combiTransitions.filter(combi => combi.getIds().includes(simpleTransId))
    }

}