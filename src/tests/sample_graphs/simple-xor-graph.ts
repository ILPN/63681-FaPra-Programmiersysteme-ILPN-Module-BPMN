import { BpmnEdge } from "src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { TestGraph } from "./TestGraph";

export class SimpleXorGraph extends TestGraph {

    constructor() {
        super()
        //startEvent --> Task1
        let startEvent = this.createStartEvent()
        let task1 = this.createServiceTask();
        this.createEdge(startEvent, task1);

        //Task1 --> SPLIT_XOR gateway
        let gatewaySplitXor = this.createXorSplit()
        this.graph.addEdge(new BpmnEdge(this.edge_idx, task1, gatewaySplitXor));


        //SPLIT_XOR gateway --> Task2
        let task2 = this.createManualTask()
        this.createEdge(gatewaySplitXor, task2);

        //SPLIT_XOR gateway --> Task3
        let task3 = this.createUserTask()
        this.createEdge(gatewaySplitXor, task3);

        //Task2 --> JOIN_XOR gateway
        let gatewayJoinXor = this.createXorJoin()
        this.createEdge(task2, gatewayJoinXor);

        //Task3 --> JOIN_XOR gateway
        this.createEdge(task3, gatewayJoinXor);

        //JOIN_XOR gateway --> EndEvent
        let endEvent = this.createEndEvent();
        this.createEdge(gatewayJoinXor, endEvent);

    }
    static create(): BpmnGraph {

        return new SimpleXorGraph().graph
    }
}

