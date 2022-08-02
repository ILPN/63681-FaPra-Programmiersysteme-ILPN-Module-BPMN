import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { TestGraph } from "./TestGraph";

export class DirectSplitJoinOr extends TestGraph {


    constructor() {
        super()

        //startEvent --> SPLIT_OR
        let startEvent = this.createStartEvent();
        let gatewaySplitOr = this.createOrSplit()
        this.createEdge(startEvent, gatewaySplitOr);

        //SPLIT_OR --> task1 
        let task1Manual = this.createManualTask()
        this.createEdge(gatewaySplitOr, task1Manual);

        //task1 --> task3 
        let task3Sending = this.createSendingTask()
        this.createEdge(task1Manual, task3Sending);

        //task3 --> eventIntermed1 
        let eventIntermed1 = this.createIntermediateEventOne();
        this.createEdge(task3Sending, eventIntermed1);

        //eventIntermed1 --> JOIN_OR
        let gatewayJoinOr = this.createOrJoin()
        this.createEdge(eventIntermed1, gatewayJoinOr);


        //SPLIT_OR --> task2
        let task2User = this.createUserTask()
        this.createEdge(gatewaySplitOr, task2User);


        //task2 --> task4
        let task4Receiving = this.createReceivingTask()
        this.createEdge(task2User, task4Receiving);

        //task4 --> eventIntermed2 
        let eventIntermed2 = this.createIntermediateEventTwo()
        this.createEdge(task4Receiving, eventIntermed2);

        //eventIntermed2 --> JOIN_OR
        this.createEdge(eventIntermed2, gatewayJoinOr);

        //SPLIT_OR --> JOIN OR
        this.createEdge(gatewaySplitOr, gatewayJoinOr);

        //JOIN_OR --> task5
        let task5Service = this.createServiceTask()
        this.createEdge(gatewayJoinOr, task5Service);

        //task5 --> EndEvent 
        let endEvent = this.createEndEvent()
        this.createEdge(task5Service, endEvent);

    }

    static create(): BpmnGraph {

        return new DirectSplitJoinOr().graph
    }
}

