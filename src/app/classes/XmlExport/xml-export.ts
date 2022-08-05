import { BpmnEdge } from "../Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "../Basic/Bpmn/BpmnGraph";
import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { Namespace } from "./namespaces";
import { Random } from "./random";

export class XmlExporter {
    private doc: XMLDocument;
    private process: Element;
    private plane: Element;
    private header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
    private xmlElements: Array<Element>

    static exportBpmnAsXml(bpmnGraph: BpmnGraph): string | undefined {
        return new XmlExporter().generateXml(bpmnGraph)
    }
    constructor() {
        this.xmlElements = new Array<Element>()

        this.doc = document.implementation.createDocument("", "", null);
        let definitions = this.createBpmnDefinitions()
        this.process = this.createBpmnProcess(definitions);
        let diagram = this.createBpmnDiagram(definitions)
        this.plane = this.createBpmnPlane(diagram)


    }
    generateXml(bpmnGraph: BpmnGraph): string | undefined {

        //convert BPMN elements into XML tree 
        bpmnGraph.nodes.forEach(node => this.convertBpmnNodeToXml(node))

        //to string
        var xmlString = new XMLSerializer().serializeToString(this.doc);

        return this.header + xmlString
    }

    private convertBpmnNodeToXml(bpmnNode: BpmnNode) {
        if (BpmnUtils.isStartEvent(bpmnNode))
            this.createStartEvent(bpmnNode)


    }
    private createBpmnDefinitions(): Element {

        let definitions = this.doc.createElementNS(Namespace.BPMN, Namespace.DEFINITIONS_ELEMENT);

        //namespaces
        definitions.setAttribute("xmlns:xsi", Namespace.XSI)
        definitions.setAttribute("xmlns:bpmndi", Namespace.BPMNDI)
        definitions.setAttribute("xmlns:dc", Namespace.DC)
        definitions.setAttribute("xmlns:di", Namespace.DI)
        definitions.setAttribute("targetNamespace", Namespace.TARGET)

        //id
        definitions.setAttribute("id", Namespace.DEFINITIONS_ID)

        this.doc.appendChild(definitions)

        return definitions
    }

    private createStartEvent(bpmnNode: BpmnNode): Element {
        var start = this.doc.createElementNS(Namespace.BPMN, Namespace.START_ELEMENT)
        start.setAttribute("id", bpmnNode.id + "_" + Random.id())

        //add under <bpmn:process>
        bpmnNode.outEdges.forEach(out => this.createOutEdge(out, start))
        this.process.appendChild(start);

        //add under diagram's <bpmndi:BPMNPlane>
        var startShape = this.doc.createElementNS(Namespace.BPMNDI, Namespace.SHAPE_ELEMENT)
        startShape.setAttribute("id", Namespace.SHAPE + "_" + bpmnNode.id + "_" + Random.id())
        startShape.setAttribute("bpmnElement", start.getAttribute("id")!)
        startShape.appendChild(this.createStartEventBounds(bpmnNode))

        this.plane.appendChild(startShape)

        return start
    }

    private createStartEventBounds(bpmnNode: BpmnNode): Element {
        //<dc:Bounds x="156" y="81" width="36" height="36" />
        var bounds = this.doc.createElementNS(Namespace.DC, Namespace.BOUNDS_ELEMENT)
        bounds.setAttribute("x", bpmnNode.x.toString())
        bounds.setAttribute("y", bpmnNode.y.toString())
        bounds.setAttribute("width", "36")
        bounds.setAttribute("height", "36")
        return bounds

    }

    private createOutEdge(bpmnEdge: BpmnEdge, from: Element): Element {

        var outEdge = this.doc.createElementNS(Namespace.BPMN, Namespace.PROCESS_ELEMENT)
        outEdge.innerHTML = bpmnEdge.id + "_" + Random.id()
        from.appendChild(outEdge);

        return outEdge
    }

    private createBpmnProcess(definitions: Element): Element {

        var process = this.doc.createElementNS(Namespace.BPMN, Namespace.PROCESS_ELEMENT)
        process.setAttribute("id", Namespace.PROCESS_ID)
        definitions.appendChild(process);

        return process
    }

    private createBpmnDiagram(definitions: Element): Element {
        var diagram = this.doc.createElementNS(Namespace.BPMNDI, Namespace.DIAGRAM_ELEMENT)
        diagram.setAttribute("id", Namespace.DIAGRAM_ID)
        definitions.appendChild(diagram);

        return diagram
    }

    private createBpmnPlane(diagram: Element): Element {
        var plane = this.doc.createElementNS(Namespace.BPMNDI, Namespace.PLANE_ELEMENT)
        plane.setAttribute("id", Namespace.PLANE_ID)
        plane.setAttribute("bpmnElement", this.process.getAttribute("id")!)
        diagram.appendChild(plane);

        return plane
    }
}