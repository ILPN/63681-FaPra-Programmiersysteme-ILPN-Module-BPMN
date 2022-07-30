import { SwitchController } from "src/app/classes/Basic/Switch/switch-controller";
import { SwitchableGateway } from "src/app/classes/Basic/Switch/SwitchableGateway";
import { SwitchableGraph } from "src/app/classes/Basic/Switch/SwitchableGraph";
import { SwitchableNode } from "src/app/classes/Basic/Switch/SwitchableNode";
import { OrGraphWithNestedOr } from "../sample_graphs/or-graph-with-nested-or";
import { GraphValidationService } from "../../../app/services/graph-validation.service";
import { Labels } from "../sample_graphs/labels";


describe('OR graph with nested OR gateway', () => {
    let graph: SwitchableGraph;
    let controller: SwitchController;

    let startEvent: SwitchableNode
    let gatewaySplitOrParent: SwitchableNode;
    let task1Manual: SwitchableNode;
    let task2User: SwitchableNode;
    let gatewaySplitOrNested: SwitchableNode
    let task3Business: SwitchableNode
    let task4Service: SwitchableNode
    let gatewayJoinOrNested: SwitchableNode
    let gatewayJoinOrParent: SwitchableNode
    let task5Sending: SwitchableNode
    let endEvent: SwitchableNode

    beforeEach(() => {
        graph = new SwitchableGraph(OrGraphWithNestedOr.create())
        controller = graph.controller

        startEvent = graph.getNode(Labels.START)!
        gatewaySplitOrParent = graph.getNode(Labels.OR_SPLIT)!
        task1Manual = graph.getNode(Labels.MANUAL)!
        task2User = graph.getNode(Labels.USER)!
        gatewaySplitOrNested = graph.getNode(Labels.ORSPLIT_NESTED)!
        task3Business = graph.getNode(Labels.BUSINESS)!
        task4Service = graph.getNode(Labels.SERVICE)!
        gatewayJoinOrNested = graph.getNode(Labels.ORJOIN_NESTED)!

        gatewayJoinOrParent = graph.getNode(Labels.OR_JOIN)!
        task5Sending = graph.getNode(Labels.SEND)!
        endEvent = graph.getNode(Labels.END)!

    });



    test('Recursive search for preceding NESTED SPLIT gateway', () => {
        let nestedSplit = (gatewayJoinOrNested as SwitchableGateway).searchCorrespondingSplitGateway(graph)

        expect(nestedSplit?.id).toEqual(gatewaySplitOrNested.id)

    });

    test('Recursive search for preceding PARENT SPLIT gateway', () => {
        let parentSplit = (gatewayJoinOrParent as SwitchableGateway).searchCorrespondingSplitGateway(graph)

        expect(parentSplit?.id).toEqual(gatewaySplitOrParent.id)

    });



});
