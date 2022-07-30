import { Validator } from "src/app/classes/Basic/Bpmn/graph-validator";
import { AndGraphThreeLevelsWithEvents } from "../sample_graphs/and-graph-three-levels-with-events";
import { DirectSplitJoinOr } from "../sample_graphs/direct-split-join-or-with-three-levels";
import { OrGraphWithNestedOr } from "../sample_graphs/or-graph-with-nested-or";
import { OrSequenceGraph } from "../sample_graphs/or-sequence-graph";
import { Or3Level } from "../sample_graphs/or-with-three-levels";
import { SimpleAndGraph } from "../sample_graphs/simple-and-graph";
import { SimpleGraphNoGateways } from "../sample_graphs/simple-graph-no-gateways";
import { SimpleOrGraph } from "../sample_graphs/simple-or-graph";
import { SimpleXorGraph } from "../sample_graphs/simple-xor-graph";
import { XorGraphWithNestedAnd } from "../sample_graphs/xor-graph-with-nested-and";



describe('Valid BPMN graphs should be evaluated as valid', () => {
   


    test('Test simple OR graph is valid', () => {

        let validator = new Validator(SimpleOrGraph.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });

   
    test('Test simple AND graph is valid', () => {

        let validator = new Validator(SimpleAndGraph.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });

    test('Test simple XOR graph is valid', () => {

        let validator = new Validator(SimpleXorGraph.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });

    test('Test AND graph with 3 Levels and Intermediate Events is valid', () => {

        let validator = new Validator(AndGraphThreeLevelsWithEvents.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });

    test('Test OR graph with 3 Levels is valid', () => {

        let validator = new Validator(Or3Level.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });

    test('Test OR graph with nested OR gateway is valid', () => {

        let validator = new Validator(OrGraphWithNestedOr.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });

    test('Test direct OR graph with intermediate events is valid', () => {

        let validator = new Validator(DirectSplitJoinOr.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });

    test('Test OR sequence graph is valid', () => {

        let validator = new Validator(OrSequenceGraph.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });

    test('Test simple graph with no gateways is valid', () => {

        let validator = new Validator(SimpleGraphNoGateways.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });

    test('Test XOR graph with nested AND is valid', () => {

        let validator = new Validator(XorGraphWithNestedAnd.create().nodes)
        let result = validator.validateGraph()
        expect(result.valid)
        expect(result.errors === "")

    });


});
