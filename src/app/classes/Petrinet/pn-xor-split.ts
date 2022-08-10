import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { PnElement } from "./pn-element";
import { PnSubnet } from "./pn-subnet";
import { Transition } from "./transition";

/**
 * Each XorSplit path in BPMN graph is represented by a transition in petri net;
 * all transitions are connected to one preceding place
 */
export class PnXorSplit extends PnSubnet {

    constructor(bpmnNode: BpmnNode) {
        super(bpmnNode);

        //for adding index to the label of each transition
        let counter: number = 1;

        //one transition already exists
        this.transitions[0].addCounterToLabelAndId(counter++);

        //create as many transitions as there are outgoing edges
        //connect the only one incoming place to all the transitions
        while (this.transitions.length != bpmnNode.outEdges.length) {
            let trans = this.addTransition(new Transition(bpmnNode.id, bpmnNode.label, counter++));
            if (this.inputPlace)
                this.addArc(Arc.create(this.inputPlace, trans))
            else
                this.setErrorStatus(" XOR-Split " + this.id + " kann nicht erstellt werden. Eingangsstelle fehlt. ")
        }

    }

    

    override addArcTo(to: PnElement) : {error: string, ok: boolean}{
        let transition: Transition | undefined = this.findNotConnectedTransition();

        if (transition) {
            let arc: Arc = Arc.create(transition, to);
            transition.setConnected();
            this.addArc(arc);
            return {error: "", ok: true}
        }

        let errText = " XOR-Split " + this.id + " kann nicht erstellt werden. Eingangsstelle fehlt. "
        return {error: errText, ok: false}

    }


}