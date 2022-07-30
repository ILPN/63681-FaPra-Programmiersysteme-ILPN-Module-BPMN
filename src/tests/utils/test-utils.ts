import { BpmnNode } from "src/app/classes/Basic/Bpmn/BpmnNode";

export class TestUtils{

    public static sameNode(node1: BpmnNode, node2: BpmnNode): boolean{
        return node1.id === node2.id
    }
}