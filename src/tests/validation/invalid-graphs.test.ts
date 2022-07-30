import { Validator } from "src/app/classes/Basic/Bpmn/graph-validator";
import { NoEndEventGraph } from "../invalid_graphs/no-end-event-graph";
import { NoStartEventGraph } from "../invalid_graphs/no-start-event-graph";



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


   
   

});
