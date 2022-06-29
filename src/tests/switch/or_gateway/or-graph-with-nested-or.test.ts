import { SwitchController } from "src/app/classes/Basic/Switch/switch-controller";
import { SwitchableGateway } from "src/app/classes/Basic/Switch/SwitchableGateway";
import { SwitchableGraph } from "src/app/classes/Basic/Switch/SwitchableGraph";
import { SwitchableNode } from "src/app/classes/Basic/Switch/SwitchableNode";
import { OrGraphWithNestedOr } from "../sample_graphs/or-graph-with-nested-or";


describe('OR graph with nested OR gateway', () => {
    let diagram: SwitchableGraph;
    let controller: SwitchController;

    //nodes
    let startEvent: SwitchableNode
    let gatewaySplitOrParent: SwitchableGateway
    let task1: SwitchableNode
    let task2: SwitchableNode

    //nested
    let gatewaySplitOrNested: SwitchableGateway
    let task3: SwitchableNode
    let task4: SwitchableNode
    let gatewayJoinOrNested: SwitchableGateway

    let gatewayJoinOrParent: SwitchableGateway
    let task5: SwitchableNode
    let endEvent: SwitchableNode

  

    beforeEach(() => {
        diagram = new SwitchableGraph(OrGraphWithNestedOr.create())
        controller = diagram.controller

        startEvent = diagram.getNode("StartEvent1")
        gatewaySplitOrParent = diagram.getNode("GatewaySplitOrParent")
        task1 = diagram.getNode("Task1")
        task2 = diagram.getNode("Task2")
        gatewaySplitOrNested = diagram.getNode("GatewaySplitOrNested")
        task3 = diagram.getNode("Task3")
        task4 = diagram.getNode("Task4")
        gatewayJoinOrNested = diagram.getNode("GatewayJoinOrNested")
        
        gatewayJoinOrParent = diagram.getNode("GatewayJoinOrParent")
        task5 = diagram.getNode("Task5")
        endEvent = diagram.getNode("EndEvent1")

    });
    


    test('Recursive search for preceding NESTED SPLIT gateway', () => {
        let nestedSplit = gatewayJoinOrNested.searchResponsibleSplitGateway()

        expect(nestedSplit?.id).toEqual(gatewaySplitOrNested.id)

    });

    test('Recursive search for preceding PARENT SPLIT gateway', () => {
        let parentSplit = gatewayJoinOrParent.searchResponsibleSplitGateway()

        expect(parentSplit?.id).toEqual(gatewaySplitOrParent.id)

    });

    test('Recursive search for following NESTED SPLIT gateway', () => {
        let nestedJoin = gatewaySplitOrNested.searchResponsibleJoinGateway()

        expect(nestedJoin?.id).toEqual(gatewayJoinOrNested.id)

    });

    test('Recursive search for following PARENT SPLIT gateway', () => {
        let parentJoin = gatewaySplitOrParent.searchResponsibleJoinGateway()

        expect(parentJoin?.id).toEqual(gatewayJoinOrParent.id)

    });

});