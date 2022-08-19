import { BpmnNode } from "../Basic/Bpmn/BpmnNode";

export class Exporter {


    constructor(public xmlDoc: XMLDocument) {

    }

    createElementNS(bmpnNode: BpmnNode, namespace: string, tag: string): Element {

        return this.xmlDoc.createElementNS(namespace, tag)
    }
}