import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { TestGraph } from "../sample_graphs/TestGraph";

export class StartEventWithInEdgeGraph extends TestGraph{

    constructor(){
        super()
         //startEvent --> Task1
         let startEvent = this.createStartEvent();
         let task1 = this.createServiceTask();
         this.createEdge(startEvent, task1);
 
        
        //Task1 --> EndEvent
         let endEvent = this.createEndEvent();
         this.createEdge(task1, endEvent);
         

         //INVALID
         let task = this.createBusinessRuleTask()
         this.createEdge(task, startEvent)
    }
   static create():BpmnGraph{     
    
        return new StartEventWithInEdgeGraph().graph
    }
}

