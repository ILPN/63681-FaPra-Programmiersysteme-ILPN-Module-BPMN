import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnNode } from "src/app/classes/Basic/Bpmn/BpmnNode";

export class TestGraph {

    graph: BpmnGraph
    constructor(){
        this.graph = new BpmnGraph();
    }

    createNode(node: BpmnNode, label: string): BpmnNode {
        node.label = label
        this.graph.addNode(node)
        return node
    }
}