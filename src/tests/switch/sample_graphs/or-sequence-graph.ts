import { BpmnEdge } from "src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnEventEnd } from "src/app/classes/Basic/Bpmn/events/BpmnEventEnd";
import { BpmnEventIntermediate } from "src/app/classes/Basic/Bpmn/events/BpmnEventIntermediate";
import { BpmnEventStart } from "src/app/classes/Basic/Bpmn/events/BpmnEventStart";
import { BpmnGatewayJoinOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinOr";
import { BpmnGatewaySplitOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitOr";
import { BpmnTaskManual } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskManual";
import { BpmnTaskService } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskService";
import { BpmnTaskUserTask } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskUserTask";

export class OrSequenceGraph {
    static create(): BpmnGraph {
        let graph = new BpmnGraph();

        //startEvent --> Parent OR SPLIT
        let startEvent = new BpmnEventStart("StartEvent1");
        startEvent.label = "Am Start!"
        graph.addNode(startEvent);

        let gatewaySplitOr1 = new BpmnGatewaySplitOr("GatewaySplitOr1");
        gatewaySplitOr1.label = "GatewaySplitOr1"
        graph.addNode(gatewaySplitOr1)
        graph.addEdge(new BpmnEdge("1", startEvent, gatewaySplitOr1));


        //SPLIT_OR gateway --> Task1
        let task1 = new BpmnTaskManual("Task1");
        task1.label = "ManualTask1"
        graph.addNode(task1)

        graph.addEdge(new BpmnEdge("2", gatewaySplitOr1, task1));

        //SPLIT_OR gateway --> Task2
        let task2 = new BpmnTaskUserTask("Task2");
        task2.label = "UserTask2"
        graph.addNode(task2);
        graph.addEdge(new BpmnEdge("3", gatewaySplitOr1, task2));


        //Task2 --> Task 3
        let task3 = new BpmnTaskUserTask("Task3");
        task3.label = "UserTask3"
        graph.addNode(task3);
        graph.addEdge(new BpmnEdge("4", task2, task3));

        //Task 3 --> JOIN_OR gateway1
        let gatewayJoinOr1 = new BpmnGatewayJoinOr("GatewayJoinOr1");
        gatewayJoinOr1.label = "GatewayJoinOr1"
        graph.addNode(gatewayJoinOr1)
        graph.addEdge(new BpmnEdge("5", task3, gatewayJoinOr1));

        //Task 1 --> JOIN_OR gateway1
        graph.addEdge(new BpmnEdge("6", task1, gatewayJoinOr1));

        //JOIN_OR gateway1 --> SPLIT_OR gateway2
        let gatewaySplitOr2 = new BpmnGatewaySplitOr("GatewaySplitOr2");
        gatewaySplitOr2.label = "GatewaySplitOr2"
        graph.addNode(gatewaySplitOr2)
        graph.addEdge(new BpmnEdge("7", gatewayJoinOr1, gatewaySplitOr2));


        //SPLIT_OR gateway2  --> Task 4
        let task4 = new BpmnTaskUserTask("Task4");
        task4.label = "UserTask4"
        graph.addNode(task4);
        graph.addEdge(new BpmnEdge("8", gatewaySplitOr2, task4));


        //Task4 --> Task5
        let task5 = new BpmnTaskUserTask("Task5");
        task5.label = "UserTask5"
        graph.addNode(task5);
        graph.addEdge(new BpmnEdge("9", task4, task5));

        //SPLIT_OR gateway2 --> Task 6
        let task6 = new BpmnTaskUserTask("Task6");
        task6.label = "UserTask6"
        graph.addNode(task6);
        graph.addEdge(new BpmnEdge("10", gatewaySplitOr2, task6));

        //Task6 --> Task 7
        let task7 = new BpmnTaskUserTask("Task7");
        task7.label = "UserTask7"
        graph.addNode(task7);
        graph.addEdge(new BpmnEdge("11", task6, task7));

        //Task5 --> JOIN_OR gateway2
        let gatewayJoinOr2 = new BpmnGatewayJoinOr("GatewayJoinOr2");
        gatewayJoinOr2.label = "GatewayJoinOr2"
        graph.addNode(gatewayJoinOr2)
        graph.addEdge(new BpmnEdge("12", task5, gatewayJoinOr2));

        //Task6 --> JOIN_OR gateway2
        graph.addEdge(new BpmnEdge("13", task7, gatewayJoinOr2));

        //JOIN_OR gateway2 --> EndEvent
        let endEvent = new BpmnEventEnd("EndEvent1");
        endEvent.label = "End"
        graph.addNode(endEvent);

        graph.addEdge(new BpmnEdge("14", gatewayJoinOr2, endEvent));

        return graph
    }
}

