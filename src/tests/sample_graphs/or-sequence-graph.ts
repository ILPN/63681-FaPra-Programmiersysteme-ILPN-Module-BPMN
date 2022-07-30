import { BpmnEdge } from "src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnEventEnd } from "src/app/classes/Basic/Bpmn/events/BpmnEventEnd";
import { BpmnEventStart } from "src/app/classes/Basic/Bpmn/events/BpmnEventStart";
import { BpmnGatewayJoinOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinOr";
import { BpmnGatewaySplitOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitOr";
import { BpmnTaskManual } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskManual";
import { BpmnTaskUserTask } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskUserTask";
import { TestGraph } from "./TestGraph";

export class OrSequenceGraph extends TestGraph {
    constructor() {
        super()

        //startEvent --> first OR SPLIT
        let startEvent = this.createStartEvent()

        let gatewaySplitOr1 = this.createOrSplit()
        this.createEdge(startEvent, gatewaySplitOr1);


        //first SPLIT_OR gateway --> Task1
        let task1 = this.createManualTask()
        this.createEdge(gatewaySplitOr1, task1);

        //SPLIT_OR gateway --> Task2
        let task2 = this.createUserTask()
        this.createEdge(gatewaySplitOr1, task2);

        //Task2 --> Task 3
        let task3 = this.createSendingTask()
        this.createEdge(task2, task3);

        //Task 3 --> JOIN_OR gateway1
        let gatewayJoinOr1 = this.createOrJoin()
        this.createEdge(task3, gatewayJoinOr1);

        //Task 1 --> JOIN_OR gateway1
        this.createEdge(task1, gatewayJoinOr1);

        //JOIN_OR gateway1 --> SPLIT_OR gateway2
        let gatewaySplitOr2 = this.createOrSplitTwo()
        this.createEdge(gatewayJoinOr1, gatewaySplitOr2);


        //SPLIT_OR gateway2  --> Task 4
        let task4 = this.createReceivingTask()
        this.createEdge(gatewaySplitOr2, task4);


        //Task4 --> Task5
        let task5 = this.createBusinessRuleTask()
        this.createEdge(task4, task5);

        //SPLIT_OR gateway2 --> Task 6
        let task6 = this.createServiceTask()
        this.createEdge(gatewaySplitOr2, task6);

        //Task6 --> Task 7
        let task7 = this.createUserTaskTwo()
        this.createEdge(task6, task7);

        //Task5 --> JOIN_OR gateway2
        let gatewayJoinOr2 = this.createOrJoinTwo()
        this.createEdge(task5, gatewayJoinOr2);

        //Task6 --> JOIN_OR gateway2
        this.createEdge(task7, gatewayJoinOr2);

        //JOIN_OR gateway2 --> EndEvent
        let endEvent = this.createEndEvent()

        this.createEdge(gatewayJoinOr2, endEvent);


    }

    static create():BpmnGraph{     
    
        return new OrSequenceGraph().graph
    }
}

