import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { TestGraph } from "./TestGraph";

export class AndGraphThreeLevelsWithEvents extends TestGraph {

    constructor() {
        super()
        //startEvent --> Task1
        let startEvent = this.createStartEvent()
        let task1 = this.createServiceTask()
        this.createEdge(startEvent, task1);

        //Task1 --> SPLIT_AND gateway
        let gatewaySplitAnd = this.createAndSplit()
        this.createEdge(task1, gatewaySplitAnd);


        //SPLIT_AND gateway --> Task2
        let task2 = this.createManualTask();
        this.createEdge(gatewaySplitAnd, task2);

        //SPLIT_AND gateway --> Task3
        let task3 = this.createUserTask()
        this.createEdge(gatewaySplitAnd, task3);

        //Task2 --> Intermediate Event
        let eventInt = this.createIntermediateEventOne()
        this.createEdge(task2, eventInt);

        //Intermediate Event --> JOIN_AND gateway
        let gatewayJoinAnd = this.createJoinAnd();
        this.createEdge(eventInt, gatewayJoinAnd);

        //Task3 --> JOIN_AND gateway
        this.createEdge(task3, gatewayJoinAnd);

        //SPLIT_AND gateway --> IntermediateEvent2
        let eventInt2 = this.createIntermediateEventTwo()
        this.createEdge(gatewaySplitAnd, eventInt2);

        //IntermediateEvent2 --> task4
        let task4 = this.createBusinessRuleTask();
        this.createEdge(eventInt2, task4);

        //task4 --> JOIN_AND gateway
        this.createEdge(task4, gatewayJoinAnd);

        //JOIN_AND gateway --> task5
        let task5 = this.createReceivingTask()
        this.createEdge(gatewayJoinAnd, task5);

        //task5 --> EndEvent
        let endEvent = this.createEndEvent()
        this.createEdge(task5, endEvent);

    }
    static create(): BpmnGraph {

        return new AndGraphThreeLevelsWithEvents().graph
    }
}

