import { SwitchController } from "src/app/classes/Basic/Switch/switch-controller";
import { SwitchableGateway } from "src/app/classes/Basic/Switch/SwitchableGateway";
import { SwitchableGraph } from "src/app/classes/Basic/Switch/SwitchableGraph";
import { SwitchableNode } from "src/app/classes/Basic/Switch/SwitchableNode";
import { SwitchState } from "src/app/classes/Basic/Switch/switchstatetype";
import { Commons } from "../commons";
import { Labels } from "../sample_graphs/labels";
import { SimpleOrGraph } from "../sample_graphs/simple-or-graph";


describe('Simple graph with OR gateway', () => {
    let graph: SwitchableGraph;
    let controller: SwitchController;

    //nodes
    let startEvent: SwitchableNode
    let task1Business: SwitchableNode
    let gatewaySplitOr: SwitchableNode
    let task2Receive: SwitchableNode
    let task3User: SwitchableNode
    let gatewayJoinOr: SwitchableNode
    let endEvent: SwitchableNode


    let expectWhenStartEventClicked = function () {
        expect(startEvent.switchState).toEqual(SwitchState.enabled)
        expect(task1Business.switchState).toEqual(SwitchState.enableable)

        //rest disabled
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.disabled)
        expect(task2Receive.switchState).toEqual(SwitchState.disabled)
        expect(task3User.switchState).toEqual(SwitchState.disabled)
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.disabled)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)
    }

    let expectWhenTaskBetweenStartAndSplitGatewayClicked = () => {
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.enabled)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.enableable)

        //rest disabled
        expect(task2Receive.switchState).toEqual(SwitchState.disabled)
        expect(task3User.switchState).toEqual(SwitchState.disabled)
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.disabled)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)
    }

    let expectWhenSplitGatewayClicked = () => {
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.enabled)

        //tasks after SPLIT gateway
        expect(task2Receive.switchState).toEqual(SwitchState.enableable)
        expect(task3User.switchState).toEqual(SwitchState.enableable)

        //rest disabled
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.disabled)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)
    }



    beforeEach(() => {
        graph = new SwitchableGraph(SimpleOrGraph.create())
        controller = graph.controller

        startEvent = graph.getNode(Labels.START)!
        task1Business = graph.getNode(Labels.BUSINESS)!
        gatewaySplitOr = graph.getNode(Labels.OR_SPLIT)!
        task2Receive = graph.getNode(Labels.RECEIVE)!
        task3User = graph.getNode(Labels.USER)!
        gatewayJoinOr = graph.getNode(Labels.OR_JOIN)!
        endEvent = graph.getNode(Labels.END)!

    })
    test('Initial status of nodes when the diagram was initialized', () => {

        Commons.expectWhenStartEventEnableable(startEvent, graph)

    });



    test('Status of nodes when StartEvent is clicked', () => {

        controller.press(startEvent)

        expectWhenStartEventClicked()

    });

    test('Status of nodes when Task between StartEvent and Gateway is clicked', () => {

        controller.press(startEvent)
        controller.press(task1Business)

        expectWhenTaskBetweenStartAndSplitGatewayClicked()

    });

    test('Status of nodes when SPLIT OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1Business)
        controller.press(gatewaySplitOr)


        expectWhenSplitGatewayClicked()

    });

    test('Status of nodes when Task2 after SPLIT OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1Business)
        controller.press(gatewaySplitOr)
        controller.press(task2Receive)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2Receive.switchState).toEqual(SwitchState.enabled)
        expect(task3User.switchState).toEqual(SwitchState.enableable)

        //rest disabled
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.enableable)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)

    });

    test('Status of nodes when Task3 after SPLIT OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1Business)
        controller.press(gatewaySplitOr)
        controller.press(task3User)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2Receive.switchState).toEqual(SwitchState.enableable)
        expect(task3User.switchState).toEqual(SwitchState.enabled)

        //rest disabled
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.enableable)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)

    });

    test('Status of nodes when Task2 and Task3 after SPLIT OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1Business)
        controller.press(gatewaySplitOr)
        controller.press(task2Receive)
        controller.press(task3User)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2Receive.switchState).toEqual(SwitchState.enabled)
        expect(task3User.switchState).toEqual(SwitchState.enabled)

        //rest disabled
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.enableable)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)

    });

    test('Status of nodes when JOIN OR is clicked', () => {

        controller.press(startEvent)
        controller.press(task1Business)
        controller.press(gatewaySplitOr)
        controller.press(task2Receive)
        controller.press(gatewayJoinOr)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2Receive.switchState).toEqual(SwitchState.switched)
        expect(task3User.switchState).toEqual(SwitchState.disabled)

        //rest disabled
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.enabled)
        expect(endEvent.switchState).toEqual(SwitchState.enableable)

    });

    test('Status of nodes when END Event is clicked first time', () => {

        controller.press(startEvent)
        controller.press(task1Business)
        controller.press(gatewaySplitOr)
        controller.press(task2Receive)
        controller.press(gatewayJoinOr)
        controller.press(endEvent)

        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2Receive.switchState).toEqual(SwitchState.switched)
        expect(task3User.switchState).toEqual(SwitchState.disabled)

        //rest disabled
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.switched)
        expect(endEvent.switchState).toEqual(SwitchState.enabled)

    });

    test('Status of nodes when Enabled END Event is clicked (Round2)', () => {

        controller.press(startEvent)
        controller.press(task1Business)
        controller.press(gatewaySplitOr)
        controller.press(task2Receive)
        controller.press(gatewayJoinOr)
        controller.press(endEvent)
        //finish round1 and start round2
        controller.press(endEvent)
        Commons.expectWhenStartEventEnableable(startEvent, graph)

        //round2 
        controller.press(startEvent)
        expectWhenStartEventClicked()

        //Task1
        controller.press(task1Business)
        expectWhenTaskBetweenStartAndSplitGatewayClicked()

        //SPLIT OR
        controller.press(gatewaySplitOr)
        expectWhenSplitGatewayClicked()

        //Task 3
        controller.press(task3User)
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.switched)
        expect(task2Receive.switchState).toEqual(SwitchState.enableable)
        expect(task3User.switchState).toEqual(SwitchState.enabled)
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.enableable)
        expect(endEvent.switchState).toEqual(SwitchState.disabled)

        //JOIN OR
        controller.press(gatewayJoinOr)
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.switched)
        expect(task2Receive.switchState).toEqual(SwitchState.disabled)
        expect(task3User.switchState).toEqual(SwitchState.switched)
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.enabled)
        expect(endEvent.switchState).toEqual(SwitchState.enableable)

        //End Event first time - to enable
        controller.press(endEvent)
        expect(startEvent.switchState).toEqual(SwitchState.switched)
        expect(task1Business.switchState).toEqual(SwitchState.switched)
        expect(gatewaySplitOr.switchState).toEqual(SwitchState.switched)

        //tasks after SPLIT gateway
        expect(task2Receive.switchState).toEqual(SwitchState.disabled)
        expect(task3User.switchState).toEqual(SwitchState.switched)

        //rest disabled
        expect(gatewayJoinOr.switchState).toEqual(SwitchState.switched)
        expect(endEvent.switchState).toEqual(SwitchState.enabled)

        //End Event second time - to start round 3
        controller.press(endEvent)
        Commons.expectWhenStartEventEnableable(startEvent, graph)
    });


   

    test('Recursive search for preceding SPLIT gateway', () => {
        let splitGateway = (gatewayJoinOr as SwitchableGateway).searchCorrespondingSplitGateway(graph)

        expect(splitGateway?.id).toEqual(gatewaySplitOr.id)

    });

})