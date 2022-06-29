import { SwitchableGateway } from "src/app/classes/Basic/Switch/SwitchableGateway";
import { SwitchState } from "src/app/classes/Basic/Switch/switchstatetype";
import { SwitchController } from "src/app/classes/Basic/Switch/switch-controller";
import { SwitchableGraph } from "src/app/classes/Basic/Switch/SwitchableGraph";
import { SwitchableNode } from "src/app/classes/Basic/Switch/SwitchableNode";
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

    //common methods
    let expectWhenStartEventEnableable = function () {
        expect(startEvent.switchState).toEqual(SwitchState.enableable)
        for (let node of diagram.switchNodes)
            if (node !== startEvent)
                expect(node.switchState).toEqual(SwitchState.disabled)
    }

    let expectWhenStartEventClicked = function(){
        expect(startEvent.switchState).toEqual(SwitchState.enabled)
        expect(task1.switchState).toEqual(SwitchState.enableable)

        //rest disabled
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.disabled)
        expect(task2.switchState).toEqual(SwitchState.disabled)
        expect(task3.switchState).toEqual(SwitchState.disabled)
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.disabled)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)
    }

    let expectWhenTaskBetweenStartAndSplitGatewayClicked = () => {
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.enabled)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.enableable)

        //rest disabled
        expect(task2.switchState).toEqual(SwitchState.disabled)
        expect(task3.switchState).toEqual(SwitchState.disabled)
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.disabled)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)
    }

    let expectWhenSplitGatewayClicked = () => {
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.enabled)

        //tasks after SPLIT gateway
        expect(task2.switchState).toEqual(SwitchState.enableable)
        expect(task3.switchState).toEqual(SwitchState.enableable)

        //rest disabled
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.disabled)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)
    }



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

        expectWhenStartEventEnableable()

    });



    test('Status of nodes when StartEvent is clicked', () => {

        controller.press(startEvent)

        expectWhenStartEventClicked()

    });

    test('Status of nodes when Task between StartEvent and Gateway is clicked', () => {

        controller.press(startEvent)
        controller.press(task1)

        expectWhenTaskBetweenStartAndSplitGatewayClicked()

    });

    test('Status of nodes when SPLIT OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1)
        controller.press(gatewaySplitOr1)


        expectWhenSplitGatewayClicked()

    });

    test('Status of nodes when Task2 after SPLIT OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1)
        controller.press(gatewaySplitOr1)
        controller.press(task2)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2.switchState).toEqual(SwitchState.enabled)
        expect(task3.switchState).toEqual(SwitchState.enableable)

        //rest disabled
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.enableable)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)

    });

    test('Status of nodes when Task3 after SPLIT OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1)
        controller.press(gatewaySplitOr1)
        controller.press(task3)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2.switchState).toEqual(SwitchState.enableable)
        expect(task3.switchState).toEqual(SwitchState.enabled)

        //rest disabled
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.enableable)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)

    });

    test('Status of nodes when Task2 and Task3 after SPLIT OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1)
        controller.press(gatewaySplitOr1)
        controller.press(task2)
        controller.press(task3)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2.switchState).toEqual(SwitchState.enabled)
        expect(task3.switchState).toEqual(SwitchState.enabled)

        //rest disabled
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.enableable)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)

    });

    test('Status of nodes when JOIN OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1)
        controller.press(gatewaySplitOr1)
        controller.press(task2)
        controller.press(gatewayJoinOr1)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2.switchState).toEqual(SwitchState.switched)
        expect(task3.switchState).toEqual(SwitchState.disabled)

        //rest disabled
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.enabled)
        expect(endEvent.switchState).toEqual(SwitchState.enableable)

    });

    test('Status of nodes when END Event is clicked first time', () => {

        controller.press(startEvent)
        controller.press(task1)
        controller.press(gatewaySplitOr1)
        controller.press(task2)
        controller.press(gatewayJoinOr1)
        controller.press(endEvent)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2.switchState).toEqual(SwitchState.switched)
        expect(task3.switchState).toEqual(SwitchState.disabled)

        //rest disabled
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.switched)
        expect(endEvent.switchState).toEqual(SwitchState.enabled)

    });

    test('Status of nodes when Enabled END Event is clicked (Round2)', () => {

        controller.press(startEvent)
        controller.press(task1)
        controller.press(gatewaySplitOr1)
        controller.press(task2)
        controller.press(gatewayJoinOr1)
        controller.press(endEvent)
        //finish round1 and start round2
        controller.press(endEvent)
        expectWhenStartEventEnableable()

        //round2 
        controller.press(startEvent)
        expectWhenStartEventClicked()

        //Task1
        controller.press(task1)
        expectWhenTaskBetweenStartAndSplitGatewayClicked()

        //SPLIT OR
        controller.press(gatewaySplitOr1)
        expectWhenSplitGatewayClicked()

        //Task 3
        controller.press(task3)
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.switched)
        expect(task2.switchState).toEqual(SwitchState.enableable)
        expect(task3.switchState).toEqual(SwitchState.enabled)
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.enableable)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)
        
        //JOIN OR
        controller.press(gatewayJoinOr1)
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.switched)
        expect(task2.switchState).toEqual(SwitchState.disabled)
        expect(task3.switchState).toEqual(SwitchState.switched)
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.enabled)
        expect(endEvent.switchState).toEqual(SwitchState.enableable)

        //End Event first time - to enable
        controller.press(endEvent)
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr1.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2.switchState).toEqual(SwitchState.disabled)
        expect(task3.switchState).toEqual(SwitchState.switched)

        //rest disabled
        expect(gatewayJoinOr1.switchState).toEqual(SwitchState.switched)
        expect(endEvent.switchState).toEqual(SwitchState.enabled)

        //End Event second time - to start round 3
        controller.press(endEvent)
        expectWhenStartEventEnableable()
    });


    test('Recursive search for preceding SPLIT gateway', () => {
        // controller.press(startEvent)
        // controller.press(task1)
        // controller.press(gatewaySplitOr1)
        // controller.press(task2)

        // let found: boolean = controller.recursivelySearchForResponsibleSplitGateway(task2, [])

        // expect(found).toEqual(false)

    });

})