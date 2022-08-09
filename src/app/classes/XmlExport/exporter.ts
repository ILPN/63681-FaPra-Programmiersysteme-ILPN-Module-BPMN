import { BpmnNode } from "../Basic/Bpmn/BpmnNode";

export class Exporter {


    constructor(public xmlDoc: XMLDocument) {

    }

    createElementNS(bmpnNode: BpmnNode, namespace: string, tag: string | undefined): { element: Element | null, error: string } {
        
        if (!tag)
            return { element: null, error: " BPMN element " + bmpnNode.id + " hat keinen passenden XML tag. " }

        let xmlElement = this.xmlDoc.createElementNS(namespace, tag)
        return {
            element: xmlElement, error: ""
        }
    }
}