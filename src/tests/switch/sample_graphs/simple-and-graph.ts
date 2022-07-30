import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { TestGraph } from "./TestGraph";

export class SimpleAndGraph extends TestGraph{

    constructor(){
        super()
         //startEvent --> Task1
         let startEvent = this.createStartEvent();
         let task1 = this.createServiceTask();
         this.createEdge(startEvent, task1);
 
         //Task1 --> SPLIT_AND gateway
         let gatewaySplitAnd1 = this.createAndSplit();
         this.createEdge(task1, gatewaySplitAnd1);
       
 
         //SPLIT_AND gateway --> Task2
         let task2 = this.createManualTask();
         this.createEdge(gatewaySplitAnd1, task2);
 
         //SPLIT_AND gateway --> Task3
         let task3 = this.createUserTask();
         this.createEdge(gatewaySplitAnd1, task3);
 
         //Task2 --> JOIN_AND gateway
         let gatewayJoinAnd = this.createJoinAnd()
         this.createEdge(task2, gatewayJoinAnd);
 
         //Task3 --> JOIN_AND gateway
         this.createEdge(task3, gatewayJoinAnd);
 
         //JOIN_AND gateway --> EndEvent
         let endEvent = this.createEndEvent()
         this.createEdge(gatewayJoinAnd, endEvent);

    }
   static create():BpmnGraph{     
    
        return new SimpleAndGraph().graph
    }
}

