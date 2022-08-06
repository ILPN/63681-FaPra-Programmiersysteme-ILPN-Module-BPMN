import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { TestGraph } from "./TestGraph";

export class XorGraphWithNestedAnd extends TestGraph{
    constructor(){
        super()
       
        //startEvent --> Parent XOR SPLIT
        let startEvent = this.createStartEvent();
        let gatewaySplitOrParent = this.createXorSplit()
        this.createEdge(startEvent, gatewaySplitOrParent);

        //Parent XOR SPLIT --> Task1
        let task1 = this.createSendingTask();
        this.createEdge(gatewaySplitOrParent, task1);

        //SPLIT_XOR gateway --> Task2
        let task2 = this.createReceivingTask();
        this.createEdge(gatewaySplitOrParent, task2)

        //Task2 --> nested AND SPLIT
        let gatewaySplitAndNested = this.createAndSplit();
        this.createEdge(task2, gatewaySplitAndNested);
       
        //nested AND SPLIT --> Task 3
        let task3 = this.createUserTask();
        this.createEdge(gatewaySplitAndNested, task3);

        //nested AND SPLIT --> Task 4
        let task4 = this.createServiceTask();
        this.createEdge(gatewaySplitAndNested, task4);
        
        //Task 3 --> Nested JOIN_AND gateway
        let gatewayJoinAndNested = this.createJoinAnd();
        this.createEdge(task3, gatewayJoinAndNested);

        //Task4 --> Nested JOIN_OR gateway
        this.createEdge(task4, gatewayJoinAndNested);

        //Nested JOIN_AND --> Parent JOIN_XOR
        let gatewayJoinXorParent = this.createXorJoin();
        this.createEdge(gatewayJoinAndNested, gatewayJoinXorParent);

        //Task 1 --> Parent JOIN_XOR
        this.createEdge(task1, gatewayJoinXorParent);

        //Parent JOIN_XOR gateway --> Task 5
        let task5 = this.createManualTask();
        this.createEdge(gatewayJoinXorParent, task5);
        
        //Task5 --> EndEvent
        let endEvent = this.createEndEvent();
        this.createEdge(task5, endEvent);

    }

    static create():BpmnGraph{     
    
        return new XorGraphWithNestedAnd().graph
    }
}

