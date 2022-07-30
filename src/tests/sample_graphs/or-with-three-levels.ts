import { BpmnEdge } from "src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnEventEnd } from "src/app/classes/Basic/Bpmn/events/BpmnEventEnd";
import { BpmnEventIntermediate } from "src/app/classes/Basic/Bpmn/events/BpmnEventIntermediate";
import { BpmnEventStart } from "src/app/classes/Basic/Bpmn/events/BpmnEventStart";
import { BpmnGatewayJoinOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinOr";
import { BpmnGatewaySplitOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitOr";
import { BpmnTaskManual } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskManual";
import { BpmnTaskSending } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskSending";
import { BpmnTaskService } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskService";
import { TestGraph } from "./TestGraph";

export class Or3Level extends TestGraph {


    constructor() {
        super()

        //startEvent --> SPLIT_OR
        let startEvent = this.createStartEvent()
        let gatewaySplitOr = this.createOrSplit()
        this.createEdge(startEvent, gatewaySplitOr);

        //SPLIT_OR --> task1 
        let task1 = this.createManualTask();
        this.createEdge(gatewaySplitOr, task1);

        //task1 --> task2
        let task2 = this.createSendingTask()
        this.createEdge(task1, task2);

        //task2 --> eventIntermed1 
        let eventIntermed1 = this.createIntermediateEventOne()
        this.createEdge(task2, eventIntermed1);

        //eventIntermed1 --> JOIN_OR
        let gatewayJoinOr = this.createOrJoin()
        this.createEdge(eventIntermed1, gatewayJoinOr);


        //SPLIT_OR --> task3
        let task3 = this.createUserTask()
        this.createEdge(gatewaySplitOr, task3);


        //task3 Hotel suchen --> task4 Hotel buchen
        let task4 = this.createBusinessRuleTask()
        this.createEdge(task3, task4);

        //task4 --> eventIntermed2 
        let eventIntermed2 = this.createIntermediateEventTwo()
        this.createEdge(task4, eventIntermed2);

        //eventIntermed2 --> JOIN_OR
        this.createEdge(eventIntermed2, gatewayJoinOr);

        //SPLIT_OR --> JOIN OR
        this.createEdge(gatewaySplitOr, gatewayJoinOr);

        //JOIN_OR --> task5 
        let task5 = this.createServiceTask()
        this.createEdge(gatewayJoinOr, task5);

        //task5 --> EndEvent 
        let endEvent = this.createEndEvent()
        this.createEdge(task5, endEvent);

        
    }

    static create(): BpmnGraph {

        return new Or3Level().graph
    }
}

