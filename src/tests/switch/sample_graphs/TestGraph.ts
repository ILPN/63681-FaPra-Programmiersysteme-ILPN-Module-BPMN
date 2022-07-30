import { BpmnEdge } from "src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnNode } from "src/app/classes/Basic/Bpmn/BpmnNode";
import { BpmnEventEnd } from "src/app/classes/Basic/Bpmn/events/BpmnEventEnd";
import { BpmnEventIntermediate } from "src/app/classes/Basic/Bpmn/events/BpmnEventIntermediate";
import { BpmnEventStart } from "src/app/classes/Basic/Bpmn/events/BpmnEventStart";
import { BpmnGatewayJoinAnd } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinAnd";
import { BpmnGatewayJoinOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinOr";
import { BpmnGatewayJoinXor } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinXor";
import { BpmnGatewaySplitAnd } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitAnd";
import { BpmnGatewaySplitOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitOr";
import { BpmnGatewaySplitXor } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitXor";
import { BpmnTaskBusinessRule } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskBusinessRule";
import { BpmnTaskManual } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskManual";
import { BpmnTaskReceiving } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskReceiving";
import { BpmnTaskSending } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskSending";
import { BpmnTaskService } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskService";
import { BpmnTaskUserTask } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskUserTask";

export class TestGraph {
    _edge_idx: number
    graph: BpmnGraph
    constructor() {
        this.graph = new BpmnGraph();
        this._edge_idx = 0;
    }

    createNode(node: BpmnNode, label: string): BpmnNode {
        node.label = label
        this.graph.addNode(node)
        return node
    }

    get edge_idx(): string {
        this._edge_idx++
        return this._edge_idx.toString()
    }

    ////// TASKS ///////////////

    createManualTask(): BpmnNode {
        return this.createNode(new BpmnTaskManual("ManualTask"), "ManualTask");
    }

    createBusinessRuleTask(): BpmnNode {
        return this.createNode(new BpmnTaskBusinessRule("BRTask"), "BusinessRule")
    }

    createSendingTask(): BpmnNode {
        return this.createNode(new BpmnTaskSending("SendTask"), "SendTask");
    }

    createReceivingTask(): BpmnNode {
        return this.createNode(new BpmnTaskReceiving("ReceiveTask"), "ReceiveTask")
    }

    createUserTask(): BpmnNode {
        return this.createNode(new BpmnTaskUserTask("UserTask"), "UserTask");
    }

    createUserTaskTwo(): BpmnNode {
        return this.createNode(new BpmnTaskUserTask("UserTask2"), "UserTask2");
    }

    createServiceTask(): BpmnNode {
        return this.createNode(new BpmnTaskService("ServiceTask"), "ServiceTask");
    }

    // EVENTS

    createIntermediateEventOne(): BpmnNode {
        return this.createNode(new BpmnEventIntermediate("IntEvent1"), "IntEvent1");
    }

    createIntermediateEventTwo(): BpmnNode {
        return this.createNode(new BpmnEventIntermediate("IntEvent2"), "IntEvent2");
    }

    createEndEvent(): BpmnNode {
        return this.createNode(new BpmnEventEnd("EndEvent"), "EndEvent")
    }

    createStartEvent(): BpmnNode {
        return this.createNode(new BpmnEventStart("StartEv"), "Start");
    }

    /// GATEWAYS /////
    createXorSplit(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitXor("XORSplit"), "XORSplit");
    }

    createOrSplit(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitOr("ORSplit"), "ORSplit");

    }

    createOrSplitTwo(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitOr("ORSplitNext"), "ORSplitNext");

    }

    createNestedOrSplit(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitOr("NestedORSplit"), "NestedORSplit");

    }

    createOrJoin(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinOr("ORJoin"), "ORJoin");

    }

    createOrJoinTwo(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinOr("ORJoinNext"), "ORJoinNext");

    }

    createNestedOrJoin(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinOr("NestedORJoin"), "NestedORJoin");

    }

   
    createAndSplit(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitAnd("ANDSplit"), "ANDSplit");
    }

   

    createJoinAnd(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinAnd("ANDJoin"), "ANDJoin");
    }

    createXorJoin(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinXor("XORJoin"), "XORJoin");
    }

    
    createEdge(from: BpmnNode, to: BpmnNode): void {
        this.graph.addEdge(new BpmnEdge(this.edge_idx, from, to));
    }

   

   
    
}