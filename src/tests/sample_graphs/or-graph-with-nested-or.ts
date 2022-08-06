import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { TestGraph } from "./TestGraph";

export class OrGraphWithNestedOr extends TestGraph {
    constructor() {
        super()

        //startEvent --> Parent OR SPLIT
        let startEvent = this.createStartEvent()
        let gatewaySplitOrParent = this.createOrSplit()
        this.createEdge(startEvent, gatewaySplitOrParent);


        //SPLIT_OR gateway --> Task1
        let task1 = this.createManualTask()
        this.createEdge(gatewaySplitOrParent, task1);

        //SPLIT_OR gateway --> Task2
        let task2 = this.createUserTask();
        this.createEdge(gatewaySplitOrParent, task2);


        //Task2 --> nested OR SPLIT
        let gatewaySplitOrNested = this.createNestedOrSplit()
        this.createEdge(task2, gatewaySplitOrNested);

        //nested OR SPLIT --> Task 3
        let task3 = this.createBusinessRuleTask();
        this.createEdge(gatewaySplitOrNested, task3);

        //nested OR SPLIT --> Task 4
        let task4 = this.createServiceTask()
        this.createEdge(gatewaySplitOrNested, task4);


        //Task 3 --> Nested JOIN_OR gateway
        let gatewayJoinOrNested = this.createNestedOrJoin()
        this.createEdge(task3, gatewayJoinOrNested);

        //Task4 --> Nested JOIN_OR gateway
        this.createEdge(task4, gatewayJoinOrNested);


        //Nested JOIN_OR --> Parent JOIN_OR
        let gatewayJoinOrParent = this.createOrJoin()
        this.createEdge(gatewayJoinOrNested, gatewayJoinOrParent);


        //Task 1 --> Parent JOIN_OR
        this.createEdge(task1, gatewayJoinOrParent);

        //Parent JOIN_OR gateway --> Task 5
        let task5 = this.createSendingTask();
        this.createEdge(gatewayJoinOrParent, task5);

        //Task5 --> EndEvent

        let endEvent = this.createEndEvent()

        this.createEdge(task5, endEvent);

    }

    static create(): BpmnGraph {

        return new OrGraphWithNestedOr().graph
    }
}

