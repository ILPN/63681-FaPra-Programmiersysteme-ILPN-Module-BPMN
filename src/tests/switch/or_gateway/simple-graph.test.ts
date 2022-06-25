import { SwitchableGateway } from "src/app/classes/Basic/Switch/SwitchableGateway";
import { SwitchState } from "src/app/classes/Basic/Switch/switchstatetype";
import { SwitchController } from "../../../../src/app/classes/Basic/Switch/switch-controller";
import { SwitchableGraph } from "../../../../src/app/classes/Basic/Switch/SwitchableGraph";
import { SwitchableNode } from "../../../../src/app/classes/Basic/Switch/SwitchableNode";
import { SimpleOrGraph } from "../sample_graphs/simple-or-graph";



describe('Simple graph with OR gateway', () => {
    let diagram: SwitchableGraph;
    let controller: SwitchController;

    //nodes
    let startEvent: SwitchableNode
    let task1: SwitchableNode
    let gatewaySplitOr1: SwitchableGateway
    let task2: SwitchableNode
    let task3: SwitchableNode
    let gatewayJoinOr1: SwitchableGateway
    let endEvent: SwitchableNode

    beforeEach(() => {
        diagram = new SwitchableGraph(SimpleOrGraph.create())
        controller = diagram.controller

        startEvent = diagram.getNode("StartEvent1")
        task1 = diagram.getNode("Task1")
        gatewaySplitOr1 = diagram.getNode("GatewaySplitOr1")
        task2 = diagram.getNode("Task2")
        task3 = diagram.getNode("Task3")
        gatewayJoinOr1 = diagram.getNode("GatewayJoinOr1")
        endEvent = diagram.getNode("EndEvent1")

    })
    test('Initial status of nodes when the diagram was initialized', () => {

        expect(startEvent.switchState).toEqual(SwitchState.enableable)
        expect(task1.switchState).toEqual(SwitchState.disabled)

    });

    test('Status of nodes when StartEvent is clicked', () => {

        controller.press(startEvent)

        expect(startEvent.switchState).toEqual(SwitchState.enabled)
        expect(task1.switchState).toEqual(SwitchState.enableable)
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.disabled)
        expect(task2.switchState).toEqual(SwitchState.disabled)
    });

    test('Recursive search for preceding SPLIT gateway', () => {
        controller.press(startEvent)
        controller.press(task1)
        controller.press(gatewaySplitOr1)
        controller.press(task2)

        let found: boolean = controller.recursivelySearchForResponsibleSplitGateway(task2, [])

        expect(found).toEqual(false)
       
    });
    
})