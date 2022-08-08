import { Arc } from "./arc";
import { CombiTransition } from "./combi-transition";
import { PnSubnet } from "./pn-subnet";
import { Transition } from "./transition";

/**
 * to convert BPMN OR-Gateway each path and each combination of paths are represented by transitions and places 
 */
export class PnOrGateway extends PnSubnet {



    override get transitions(): Transition[] {
        return this._transitions.sort((trans1, trans2) => trans1.id.localeCompare(trans2.id))
    }

    //combi transitions represent AND combinations of paths of BPMN OR-Gateway
    isCombi(trans: Transition): boolean {
        return trans instanceof CombiTransition;
    }

    //transitions representing paths of BPMN OR-Gateway
    get simpleTransitions(): Array<Transition> {
        return this.transitions.filter(trans => !this.isCombi(trans));
    }

    override findNotConnectedTransition(): Transition | undefined {
        return this.simpleTransitions.find(trans => trans.notConnected())

    }

    //transitions that represent AND combinations of paths of BPMN OR-Gateway 
    get combiTransitions(): Array<CombiTransition> {
        return this.transitions.filter(trans => this.isCombi(trans)).map(
            trans => trans as CombiTransition
        )
    }
}