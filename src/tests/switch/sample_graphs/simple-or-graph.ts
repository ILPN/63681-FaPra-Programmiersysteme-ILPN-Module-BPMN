import { BpmnEdge } from "src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnEventEnd } from "src/app/classes/Basic/Bpmn/events/BpmnEventEnd";
import { BpmnEventStart } from "src/app/classes/Basic/Bpmn/events/BpmnEventStart";
import { BpmnGatewayJoinOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinOr";
import { BpmnGatewaySplitOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitOr";
import { BpmnTaskManual } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskManual";
import { BpmnTaskService } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskService";
import { BpmnTaskUserTask } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskUserTask";

export class SimpleOrGraph{
    static create():BpmnGraph{
        let graph = new BpmnGraph();

        //startEvent --> Task1
        let startEvent = new BpmnEventStart("StartEvent1");
        startEvent.label ="Am Start!"
        //startEvent.setPosXY(60,190);
        graph.addNode(startEvent);
    
        let task1 = new BpmnTaskService("Task1");
        //task1.setPosXY(442,60) 
        task1.label = "ServiceTask"
        graph.addNode(task1)

        graph.addEdge(new BpmnEdge("1",startEvent, task1));

        //Task1 --> SPLIT_OR gateway
        let gatewaySplitOr1 = new BpmnGatewaySplitOr("GatewaySplitOr1");
        gatewaySplitOr1.label = "GatewaySplitOr1"
        graph.addNode(gatewaySplitOr1)

        graph.addEdge(new BpmnEdge("2", task1, gatewaySplitOr1));
      

        //SPLIT_OR gateway --> Task2
        let task2 = new BpmnTaskManual("Task2");
        task2.label = "ManualTask"
        graph.addNode(task2)

        graph.addEdge(new BpmnEdge("3", gatewaySplitOr1, task2));

        //SPLIT_OR gateway --> Task3
        let task3 = new BpmnTaskUserTask("Task3");
        task3.label = "UserTask"
        //task3.setPosXY(1225,190)
        graph.addNode(task3);

        graph.addEdge(new BpmnEdge("4", gatewaySplitOr1, task3));

        //Task2 --> JOIN_OR gateway
        let gatewayJoinOr1 = new BpmnGatewayJoinOr("GatewayJoinOr1");
        gatewayJoinOr1.label = "GatewayJoinOr1"
        graph.addNode(gatewayJoinOr1)

        graph.addEdge(new BpmnEdge("5", task2, gatewayJoinOr1));

        //Task3 --> JOIN_OR gateway
        graph.addEdge(new BpmnEdge("6", task3, gatewayJoinOr1));

        //JOIN_OR gateway --> EndEvent

        let endEvent = new BpmnEventEnd("EndEvent1");
        //endEvent.setPosXY(1600,190)
        endEvent.label = "End"
        graph.addNode(endEvent);

        graph.addEdge(new BpmnEdge("7", gatewayJoinOr1, endEvent));
    
        return graph
    }
}

