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

export class OrGraphWithNestedOr{
    static create():BpmnGraph{
        let graph = new BpmnGraph();

        //startEvent --> Parent OR SPLIT
        let startEvent = new BpmnEventStart("StartEvent1");
        startEvent.label ="Am Start!"
        graph.addNode(startEvent);
    
        let gatewaySplitOrParent = new BpmnGatewaySplitOr("GatewaySplitOrParent");
        gatewaySplitOrParent.label = "GatewaySplitOrParent"
        graph.addNode(gatewaySplitOrParent)
        graph.addEdge(new BpmnEdge("1",startEvent, gatewaySplitOrParent));
      

        //SPLIT_OR gateway --> Task1
        let task1 = new BpmnTaskManual("Task1");
        task1.label = "ManualTask1"
        graph.addNode(task1)

        graph.addEdge(new BpmnEdge("2", gatewaySplitOrParent, task1));

        //SPLIT_OR gateway --> Task2
        let task2 = new BpmnTaskUserTask("Task2");
        task2.label = "UserTask2"
        graph.addNode(task2);
        graph.addEdge(new BpmnEdge("3", gatewaySplitOrParent, task2));


        //Task2 --> nested OR SPLIT
        let gatewaySplitOrNested = new BpmnGatewaySplitOr("GatewaySplitOrNested");
        gatewaySplitOrNested.label = "GatewaySplitOrNested"
        graph.addNode(gatewaySplitOrNested)
        graph.addEdge(new BpmnEdge("4",task2, gatewaySplitOrNested));
        
        //nested OR SPLIT --> Task 3
        let task3 = new BpmnTaskUserTask("Task3");
        task3.label = "UserTask3"
        graph.addNode(task3);
        graph.addEdge(new BpmnEdge("5", gatewaySplitOrNested, task3));

        //nested OR SPLIT --> Task 4
        let task4 = new BpmnTaskUserTask("Task4");
        task4.label = "UserTask4"
        graph.addNode(task4);
        graph.addEdge(new BpmnEdge("6", gatewaySplitOrNested, task4));

        
        //Task 3 --> Nested JOIN_OR gateway
        let gatewayJoinOrNested = new BpmnGatewayJoinOr("GatewayJoinOrNested");
        gatewayJoinOrNested.label = "GatewayJoinOrNested"
        graph.addNode(gatewayJoinOrNested)
        graph.addEdge(new BpmnEdge("7", task3, gatewayJoinOrNested));

        //Task4 --> Nested JOIN_OR gateway
        graph.addEdge(new BpmnEdge("8", task4, gatewayJoinOrNested));


        //Nested JOIN_OR --> Parent JOIN_OR
        let gatewayJoinOrParent = new BpmnGatewayJoinOr("GatewayJoinOrParent");
        gatewayJoinOrParent.label = "GatewayJoinOrParent"
        graph.addNode(gatewayJoinOrParent)
        graph.addEdge(new BpmnEdge("9", gatewayJoinOrNested, gatewayJoinOrParent));


        //Task 1 --> Parent JOIN_OR
        graph.addEdge(new BpmnEdge("10", task1, gatewayJoinOrParent));

        //Parent JOIN_OR gateway --> Task 5
        let task5 = new BpmnTaskUserTask("Task5");
        task5.label = "UserTask5"
        graph.addNode(task5);
        graph.addEdge(new BpmnEdge("11", gatewayJoinOrParent, task5));
        
        //Task5 --> EndEvent

        let endEvent = new BpmnEventEnd("EndEvent1");
        endEvent.label = "End"
        graph.addNode(endEvent);

        graph.addEdge(new BpmnEdge("12", task5, endEvent));
    
        return graph
    }
}

