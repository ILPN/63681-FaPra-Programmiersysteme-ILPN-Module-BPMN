import { BpmnEdge } from "src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnEventEnd } from "src/app/classes/Basic/Bpmn/events/BpmnEventEnd";
import { BpmnEventStart } from "src/app/classes/Basic/Bpmn/events/BpmnEventStart";
import { BpmnGatewayJoinOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinOr";
import { BpmnGatewaySplitOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitOr";
import { BpmnTaskManual } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskManual";
import { BpmnTaskService } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskService";
import { BpmnTaskUserTask } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskUserTask";
import { TestGraph } from "./TestGraph";

export class SimpleOrGraph extends TestGraph{

    constructor(){
        super()
         //startEvent --> Task1
         let startEvent = this.createNode(new BpmnEventStart("StartEvent1"), "Am Start!");
         let task1 = this.createNode(new BpmnTaskService("Task1"), "ServiceTask");
         this.graph.addEdge(new BpmnEdge("1",startEvent, task1));
 
         //Task1 --> SPLIT_OR gateway
         let gatewaySplitOr1 = this.createNode(new BpmnGatewaySplitOr("GatewaySplitOr1"), "GatewaySplitOr1");
         this.graph.addEdge(new BpmnEdge("2", task1, gatewaySplitOr1));
       
 
         //SPLIT_OR gateway --> Task2
         let task2 = this.createNode(new BpmnTaskManual("Task2"), "ManualTask");
         this.graph.addEdge(new BpmnEdge("3", gatewaySplitOr1, task2));
 
         //SPLIT_OR gateway --> Task3
         let task3 = this.createNode(new BpmnTaskUserTask("Task3"), "UserTask");
         this.graph.addEdge(new BpmnEdge("4", gatewaySplitOr1, task3));
 
         //Task2 --> JOIN_OR gateway
         let gatewayJoinOr1 = this.createNode(new BpmnGatewayJoinOr("GatewayJoinOr1"), "GatewayJoinOr1");
         this.graph.addEdge(new BpmnEdge("5", task2, gatewayJoinOr1));
 
         //Task3 --> JOIN_OR gateway
         this.graph.addEdge(new BpmnEdge("6", task3, gatewayJoinOr1));
 
         //JOIN_OR gateway --> EndEvent
         let endEvent = this.createNode(new BpmnEventEnd("EndEvent1"), "End");
         this.graph.addEdge(new BpmnEdge("7", gatewayJoinOr1, endEvent));

    }
   static create():BpmnGraph{     
    
        return new SimpleOrGraph().graph
    }
}

