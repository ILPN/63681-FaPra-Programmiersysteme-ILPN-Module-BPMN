import { BpmnNode } from "src/app/classes/Basic/Bpmn/BpmnNode"
import { SwitchableGraph } from "src/app/classes/Basic/Switch/SwitchableGraph"
import { SwitchableNode } from "src/app/classes/Basic/Switch/SwitchableNode"
import { SwitchState } from "src/app/classes/Basic/Switch/switchstatetype"

export class Commons{

    public static expectWhenStartEventEnableable = function (startEvent: SwitchableNode, graph: SwitchableGraph) {
        expect(startEvent.switchState).toEqual(SwitchState.enableable)
        for (let node of graph.switchNodes)
            if (node !== startEvent)
                expect(node.switchState).toEqual(SwitchState.disabled)
    }

    
}

