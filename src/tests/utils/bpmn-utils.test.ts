import { BpmnUtils } from "src/app/classes/Basic/Bpmn/BpmnUtils";
import { BpmnGateway } from "src/app/classes/Basic/Bpmn/gateways/BpmnGateway";
import { Labels } from "../sample_graphs/labels";
import { SimpleAndGraph } from "../sample_graphs/simple-and-graph";
import { SimpleOrGraph } from "../sample_graphs/simple-or-graph";
import { SimpleXorGraph } from "../sample_graphs/simple-xor-graph";
import { XorGraphWithNestedAnd } from "../sample_graphs/xor-graph-with-nested-and";
import { TestUtils } from "./test-utils";



describe('Tests for methods in BpmnUtils', () => {



    test('Test search for corresponding OR gateway in simple OR graph', () => {
        //arrange
        let graph = SimpleOrGraph.create()
        let orSplit = graph.getNode(Labels.OR_SPLIT)!;
        let orJoin = graph.getNode(Labels.OR_JOIN)

        //act
        let foundOrJoin = BpmnUtils.getCorrespondingGateway(orSplit as BpmnGateway);
        let foundOrSplit = BpmnUtils.getCorrespondingGateway(orJoin as BpmnGateway);

        //assert
        expect(foundOrJoin)
        expect(BpmnUtils.isJoinOr(foundOrJoin!))
        expect(foundOrSplit)
        expect(BpmnUtils.isSplitOr(foundOrSplit!))
        expect(TestUtils.sameNode(foundOrJoin!, orJoin!))
        expect(TestUtils.sameNode(foundOrSplit!, orSplit!))
    });

    test('Test search for corresponding AND gateway in simple AND graph', () => {
        //arrange
        let graph = SimpleAndGraph.create()
        let andSplit = graph.getNode(Labels.AND_SPLIT)!;
        let andJoin = graph.getNode(Labels.AND_JOIN)

        //act
        let foundAndJoin = BpmnUtils.getCorrespondingGateway(andSplit as BpmnGateway);
        let foundAndSplit = BpmnUtils.getCorrespondingGateway(andJoin as BpmnGateway);

        //assert
        expect(foundAndJoin)
        expect(BpmnUtils.isJoinAnd(foundAndJoin!))
        expect(foundAndSplit)
        expect(BpmnUtils.isSplitAnd(foundAndSplit!))
        expect(TestUtils.sameNode(foundAndJoin!, andJoin!))
        expect(TestUtils.sameNode(foundAndSplit!, andSplit!))
    });


    test('Test search for corresponding XOR gateway in simple XOR graph', () => {
        //arrange
        let graph = SimpleXorGraph.create()
        let xorSplit = graph.getNode(Labels.XOR_SPLIT)!;
        let xorJoin = graph.getNode(Labels.XOR_JOIN)

        //act
        let foundXorJoin = BpmnUtils.getCorrespondingGateway(xorSplit as BpmnGateway);
        let foundXorSplit = BpmnUtils.getCorrespondingGateway(xorJoin as BpmnGateway);

        //assert
        expect(foundXorJoin)
        expect(BpmnUtils.isJoinXor(foundXorJoin!))
        expect(foundXorSplit)
        expect(BpmnUtils.isSplitXor(foundXorSplit!))
        expect(TestUtils.sameNode(foundXorJoin!, xorJoin!))
        expect(TestUtils.sameNode(foundXorSplit!, xorSplit!))
    });


    test('Test search for corresponding gateways in XOR graph with nested AND', () => {
        //arrange
        let graph = XorGraphWithNestedAnd.create()
        let xorSplit = graph.getNode(Labels.XOR_SPLIT)!;
        let xorJoin = graph.getNode(Labels.XOR_JOIN)
        let andSplit = graph.getNode(Labels.AND_SPLIT)!;
        let andJoin = graph.getNode(Labels.AND_JOIN)


        //act
        let foundXorJoin = BpmnUtils.getCorrespondingGateway(xorSplit as BpmnGateway);
        let foundXorSplit = BpmnUtils.getCorrespondingGateway(xorJoin as BpmnGateway);
        let foundAndJoin = BpmnUtils.getCorrespondingGateway(andSplit as BpmnGateway);
        let foundAndSplit = BpmnUtils.getCorrespondingGateway(andJoin as BpmnGateway);

        //assert
        // parent XOR JOIN
        expect(foundXorJoin)
        expect(BpmnUtils.isJoinXor(foundXorJoin!))
        expect(TestUtils.sameNode(foundXorJoin!, xorJoin!))

        //parent XOR SPLIT
        expect(foundXorSplit)
        expect(BpmnUtils.isSplitXor(foundXorSplit!))
        expect(TestUtils.sameNode(foundXorSplit!, xorSplit!))

        //nested AND JOIN
        expect(foundAndJoin)
        expect(BpmnUtils.isJoinAnd(foundAndJoin!))
        expect(TestUtils.sameNode(foundAndJoin!, andJoin!))

        //nested AND SPLIT
        expect(foundAndSplit)
        expect(BpmnUtils.isSplitAnd(foundAndSplit!))
        expect(TestUtils.sameNode(foundAndSplit!, andSplit!))
    });

    test('Test search for corresponding OR gateway in OR sequence graph', () => {
        //arrange
        let graph = SimpleOrGraph.create()
        let orSplit = graph.getNode(Labels.OR_SPLIT)!;
        let orJoin = graph.getNode(Labels.OR_JOIN)
        let orSplit2 = graph.getNode(Labels.ORSPLIT_NEXT)!;
        let orJoin2 = graph.getNode(Labels.ORJOIN_NEXT)

        //act
        let foundOrJoin = BpmnUtils.getCorrespondingGateway(orSplit as BpmnGateway);
        let foundOrSplit = BpmnUtils.getCorrespondingGateway(orJoin as BpmnGateway);
        let foundOrJoin2 = BpmnUtils.getCorrespondingGateway(orSplit2 as BpmnGateway);
        let foundOrSplit2 = BpmnUtils.getCorrespondingGateway(orJoin2 as BpmnGateway);

        //assert
        //first OR SPLIT-JOIN
        expect(foundOrJoin)
        expect(BpmnUtils.isJoinXor(foundOrJoin!))
        expect(TestUtils.sameNode(foundOrJoin!, orJoin!))
        expect(foundOrSplit)
        expect(BpmnUtils.isSplitXor(foundOrSplit!))
        expect(TestUtils.sameNode(foundOrSplit!, orSplit!))

        //subsequent OR SPLIT-JOIN
        expect(foundOrJoin2)
        expect(BpmnUtils.isJoinXor(foundOrJoin2!))
        expect(TestUtils.sameNode(foundOrJoin2!, orJoin2!))
        expect(foundOrSplit2)
        expect(BpmnUtils.isSplitXor(foundOrSplit2!))
        expect(TestUtils.sameNode(foundOrSplit2!, orSplit2!))
    });
});