import { Validator } from "src/app/classes/Basic/Bpmn/graph-validator";
import { EndEventWithOutEdgeGraph } from "../invalid_graphs/end-event-with-outedge-graph";
import { LooseTaskGraph } from "../invalid_graphs/loose-task-graph";
import { NoEndEventGraph } from "../invalid_graphs/no-end-event-graph";
import { NoJoinForSplitOrGraph } from "../invalid_graphs/no-join-for-split-or";
import { NoStartEventGraph } from "../invalid_graphs/no-start-event-graph";
import { StartEventWithInEdgeGraph } from "../invalid_graphs/start-event-with-inedge-graph";
import { Labels } from "../sample_graphs/labels";



describe('Invalid BPMN graphs should be evaluated as invalid and provide meaningfull error message', () => {
   


    test('Test graph with no start events is invalid', () => {

        let validator = new Validator(NoStartEventGraph.create().nodes)
        let result = validator.validateGraph()
        expect(!result.valid)
        expect(result.errors.includes(validator.NO_START_EVENT))

    });

    test('Test graph with no end events is invalid', () => {

        let validator = new Validator(NoEndEventGraph.create().nodes)
        let result = validator.validateGraph()
        expect(!result.valid)
        expect(result.errors.includes(validator.NO_END_EVENT))

    });

    test('Test graph with start event that has incoming edges is invalid', () => {

        let validator = new Validator(StartEventWithInEdgeGraph.create().nodes)
        let result = validator.validateGraph()
        expect(!result.valid)
        expect(result.errors.includes(validator.HAS_IN_EDGES))
        expect(result.errors.includes(Labels.START))

    });

    test('Test graph with end event that has outcoming edges is invalid', () => {

        let validator = new Validator(EndEventWithOutEdgeGraph.create().nodes)
        let result = validator.validateGraph()
        expect(!result.valid)
        expect(result.errors.includes(validator.HAS_OUT_EDGES))
        expect(result.errors.includes(Labels.END))

    });


    test('Test graph with loose task is invalid', () => {
        let testgraph = new LooseTaskGraph()

        let validator = new Validator(testgraph.graph.nodes)
        let result = validator.validateGraph()
        expect(!result.valid)
        expect(result.errors.includes(validator.HAS_NO_OUT_EDGES))
        expect(result.errors.includes(validator.HAS_NO_IN_EDGES))
        expect(result.errors.includes(testgraph.getLooseTask()))

    });

    test('Test graph with no Join-OR matching Split-OR is invalid', () => {
    
        let validator = new Validator(NoJoinForSplitOrGraph.create().nodes)
        let result = validator.validateGraph()
        expect(!result.valid)
        expect(result.errors.includes(Labels.OR_SPLIT))
        expect(result.errors.includes(validator.HAS_NO_OUT_EDGES))
    });




   
   

});
