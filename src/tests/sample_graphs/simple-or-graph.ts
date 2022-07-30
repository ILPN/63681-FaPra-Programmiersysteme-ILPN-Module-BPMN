import { BpmnEdge } from "src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnEventEnd } from "src/app/classes/Basic/Bpmn/events/BpmnEventEnd";
import { TestGraph } from "./TestGraph";

export class SimpleOrGraph extends TestGraph{

    constructor(){
        super()
         //startEvent --> Task1
         let startEvent = this.createStartEvent();
         let task1 = this.createBusinessRuleTask();         
         this.createEdge(startEvent, task1);
 
         //Task1 --> SPLIT_OR gateway
         let gatewaySplitOr = this.createOrSplit();
         this.createEdge(task1, gatewaySplitOr);
       
 
         //SPLIT_OR gateway --> Task2
         let task2 = this.createReceivingTask();
         this.createEdge(gatewaySplitOr, task2);
 
         //SPLIT_OR gateway --> Task3
         let task3 = this.createUserTask();
         this.createEdge(gatewaySplitOr, task3);
 
         //Task2 --> JOIN_OR gateway
         let gatewayJoinOr = this.createOrJoin();
         this.createEdge(task2, gatewayJoinOr);
 
         //Task3 --> JOIN_OR gateway
         this.createEdge(task3, gatewayJoinOr);
 
         //JOIN_OR gateway --> EndEvent
         let endEvent = this.createEndEvent();
         this.createEdge(gatewayJoinOr, endEvent);

    }
   static create():BpmnGraph{     
    
        return new SimpleOrGraph().graph
    }
}

