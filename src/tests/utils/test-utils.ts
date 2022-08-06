import { BpmnNode } from "src/app/classes/Basic/Bpmn/BpmnNode";

export class TestUtils {

    public static sameNode(node1: BpmnNode, node2: BpmnNode): boolean {
        if (!node1)
            return false
        if (!node2)
            return false
        return node1.id === node2.id
    }
}