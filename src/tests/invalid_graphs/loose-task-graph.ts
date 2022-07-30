import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnNode } from "src/app/classes/Basic/Bpmn/BpmnNode";
import { Labels } from "../sample_graphs/labels";
import { TestGraph } from "../sample_graphs/TestGraph";

export class LooseTaskGraph extends TestGraph {
    private looseTask: BpmnNode

    constructor() {
        super()
        //startEvent --> Task1
        let startEvent = this.createStartEvent();
        let task1 = this.createServiceTask();
        this.createEdge(startEvent, task1);


        //Task1 --> EndEvent
        let endEvent = this.createEndEvent();
        this.createEdge(task1, endEvent);


        //INVALID
        this.looseTask = this.createBusinessRuleTask()

    }
     getLooseTask(): string {
        return this.looseTask.label
    }
    
}

