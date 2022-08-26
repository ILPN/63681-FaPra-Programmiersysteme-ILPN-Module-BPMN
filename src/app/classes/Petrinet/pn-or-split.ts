import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { CombiTransition } from "./pn-combi-transition";
import { OnePlaceMultiTransitionsPnSubnet } from "./pn-oneplace-multitrans-subnet";
import { PnOrJoin } from "./pn-or-join";
import { Place } from "./pn-place";
import { Transition } from "./pn-transition";
import { PnUtils } from "./pn-utils";

/**
 * to convert OrSplit in BPMN graph all paths and their combinations 
 * have to be represented in petri net as transitions connected to one preceding place 
 */
export class PnOrSplit extends OnePlaceMultiTransitionsPnSubnet {

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        //create transitions representing combinations of paths
        let combinationsOfIds: string[][] = PnUtils.getCombinationsOfIds(PnUtils.getIds(this.transitions))
        for (let combinationOfIds of combinationsOfIds) {
            let combiTrans = new CombiTransition(bpmnNode.id, bpmnNode.label,
                this.getTransitionsByIds(combinationOfIds));

            this.addTransition(combiTrans)
            this.addArc(Arc.create(this._inputPlace, combiTrans))

        }

    }

    override get transitionsToConnectToNextSubnet(): Array<Transition> {
        let transitions = new Array<Transition>()
        let notConnected = this.findNotConnectedTransition()
        if (notConnected) {
            transitions.push(notConnected)
            transitions.push(...this.findCombiTransitionsContainingId(notConnected.id))
        }

        return transitions
    }

    /**
     * create place between split-Or and join-Or
     * @param orJoin 
     */
    connectToOrJoin(orJoin: PnOrJoin): void {
        let splitTransitions = this.transitions.filter(trans => !trans.isCombi())
        let joinTransitions = orJoin.transitions.filter(trans => !trans.isCombi())
        let pairs = PnUtils.getMatchingOrSplitJoinTransitions(splitTransitions, joinTransitions)

        pairs.forEach((join, split) => {
            let place = Place.create({ startPlace: false });
            this.addPlace(place)
            this.addArc(Arc.create(split, place));
            orJoin.addArc(Arc.create(place, join))

        })
    }

    get simpleTransitions(): Array<Transition>{
        return this.transitions.filter(trans => !trans.isCombi())
    }


    //transitions representing combinations of paths contain references to simple transitions 
    //representing these paths
    findCombiTransitionsContainingId(simpleTransId: string): Array<CombiTransition> {
        let combis = new Array<CombiTransition>()
        for (let trans of this.transitions) {
            if (trans.isCombi()) {

                let combi = (trans as CombiTransition)
                if (combi.containsId(simpleTransId))
                    combis.push(combi)
            }
        }


        return combis;
    }



}