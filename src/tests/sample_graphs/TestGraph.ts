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
import { Labels } from "./labels";

export class TestGraph {
    _edge_idx: number
    graph: BpmnGraph




    constructor() {
        this.graph = new BpmnGraph();
        this._edge_idx = 0;
    }

    createNode(node: BpmnNode): BpmnNode {
        node.label = node.id
        this.graph.addNode(node)
        return node
    }

    get edge_idx(): string {
        this._edge_idx++
        return this._edge_idx.toString()
    }

  

    ////// TASKS ///////////////

    createManualTask(): BpmnNode {
        return this.createNode(new BpmnTaskManual(Labels.MANUAL));
    }

    createBusinessRuleTask(): BpmnNode {
        return this.createNode(new BpmnTaskBusinessRule(Labels.BUSINESS))
    }

    createSendingTask(): BpmnNode {
        return this.createNode(new BpmnTaskSending(Labels.SEND));
    }

    createReceivingTask(): BpmnNode {
        return this.createNode(new BpmnTaskReceiving(Labels.RECEIVE))
    }

    createUserTask(): BpmnNode {
        return this.createNode(new BpmnTaskUserTask(Labels.USER));
    }

    createUserTaskTwo(): BpmnNode {
        return this.createNode(new BpmnTaskUserTask(Labels.USER2));
    }

    createServiceTask(): BpmnNode {
        return this.createNode(new BpmnTaskService(Labels.SERVICE));
    }

    // EVENTS

    createIntermediateEventOne(): BpmnNode {
        return this.createNode(new BpmnEventIntermediate(Labels.INTEVENT1));
    }

    createIntermediateEventTwo(): BpmnNode {
        return this.createNode(new BpmnEventIntermediate(Labels.INTEVENT2));
    }

    createEndEvent(): BpmnNode {
        return this.createNode(new BpmnEventEnd(Labels.END))
    }

    createStartEvent(): BpmnNode {
        return this.createNode(new BpmnEventStart(Labels.START));
    }

    /// GATEWAYS /////
    createXorSplit(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitXor(Labels.XOR_SPLIT));
    }

    createOrSplit(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitOr(Labels.OR_SPLIT));

    }

    createOrSplitTwo(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitOr(Labels.ORSPLIT_NEXT));

    }

    createNestedOrSplit(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitOr(Labels.ORSPLIT_NESTED));

    }

    createOrJoin(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinOr(Labels.OR_JOIN));

    }

    createOrJoinTwo(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinOr(Labels.ORJOIN_NEXT));

    }

    createNestedOrJoin(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinOr(Labels.ORJOIN_NESTED));

    }


    createAndSplit(): BpmnNode {
        return this.createNode(new BpmnGatewaySplitAnd(Labels.AND_SPLIT));
    }



    createJoinAnd(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinAnd(Labels.AND_JOIN));
    }

    createXorJoin(): BpmnNode {
        return this.createNode(new BpmnGatewayJoinXor(Labels.XOR_JOIN));
    }


    createEdge(from: BpmnNode, to: BpmnNode): void {
        this.graph.addEdge(new BpmnEdge(this.edge_idx, from, to));
    }


   
}