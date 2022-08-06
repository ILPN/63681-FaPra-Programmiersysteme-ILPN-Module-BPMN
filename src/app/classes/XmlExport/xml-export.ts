import { BpmnEdge } from "../Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "../Basic/Bpmn/BpmnGraph";
import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { Constants } from "./constants";
import { EdgeExporter } from "./edge-export";
import { Namespace } from "./namespaces";
import { TaskExporter } from "./task-export";
import { Random, Utils } from "./utils";

export class XmlExporter {
    private doc: XMLDocument;
    private process: Element;
    private plane: Element;
    private header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
    private edgeExporter: EdgeExporter



    static exportBpmnAsXml(bpmnGraph: BpmnGraph): string | undefined {
        return new XmlExporter().generateXml(bpmnGraph)
    }
    constructor() {


        this.doc = document.implementation.createDocument("", "", null);
        let definitions = this.createBpmnDefinitions()
        this.process = this.createBpmnProcess(definitions);
        let diagram = this.createBpmnDiagram(definitions)
        this.plane = this.createBpmnPlane(diagram)

        this.edgeExporter = new EdgeExporter(this.doc)
    }
    /**
     * converts BPMN Graph into XML BPMN 2.0
     * @param bpmnGraph 
     * @returns XML as string
     */
    generateXml(bpmnGraph: BpmnGraph): string | undefined {

        //convert BPMN elements into XML tree 
        bpmnGraph.nodes.forEach(node => this.convertBpmnNodeToXml(node))

        //create <bpmndi:BPMNEdge> elements (children of <bpmndi:BPMNPlane>)
        //at this point the coordinates of all elements are known so we can calculate the coordinates of edges
        this.edgeExporter.createBpmnEdgeXmlElements().forEach(
            edge => this.plane.appendChild(edge)
        )

         //create <bpmn:sequenceFlow>    elements (children of <bpmn:process>)
        //at this point the ids of all elements are set so we can create sequence flows
        this.edgeExporter.createSequenceFlows().forEach(
            flow => this.process.appendChild(flow)
        )

        //to string
        var xmlString = new XMLSerializer().serializeToString(this.doc);

        return this.header + xmlString
    }

    private convertBpmnNodeToXml(bpmnNode: BpmnNode) {
        BpmnUtils.isStartEvent(bpmnNode) && this.createStartEvent(bpmnNode)

        BpmnUtils.isTask(bpmnNode) && this.createTask(bpmnNode)
        BpmnUtils.isEndEvent(bpmnNode) && this.createEndEvent(bpmnNode)
    }

    private createTask(bpmnNode: BpmnNode) {
        let exporter = new TaskExporter(bpmnNode, this.doc)
        let task = exporter.bpmnTaskXml();
        this.process.appendChild(task)
        let taskShape = exporter.bpmnShapeXml(task.getAttribute("id")!)
        this.plane.appendChild(taskShape)

        // edges as XML children of task + every outEdge as bpmnShape under plane
        bpmnNode.outEdges.forEach(outEdge => this.edgeExporter.createBpmnOutgoingXml(outEdge, task, taskShape))
        bpmnNode.inEdges.forEach(inEdge => this.edgeExporter.createBpmnIncomingXml(inEdge, task, taskShape))
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
        //add under <bpmn:process>
        var start = this.doc.createElementNS(Namespace.BPMN, Namespace.START_ELEMENT)
        start.setAttribute("id", bpmnNode.id + "_" + Random.id())
        this.process.appendChild(start)

        //add under diagram's <bpmndi:BPMNPlane>
        var startShape = this.doc.createElementNS(Namespace.BPMNDI, Namespace.SHAPE_ELEMENT)
        startShape.setAttribute("id", Namespace.SHAPE + "_" + bpmnNode.id + "_" + Random.id())
        startShape.setAttribute("bpmnElement", start.getAttribute("id")!)
        startShape.appendChild(this.createEventBounds(bpmnNode))

        this.plane.appendChild(startShape)

        // outgoing edges
        bpmnNode.outEdges.forEach(outEdge => this.edgeExporter.createBpmnOutgoingXml(outEdge, start, startShape))

        return start
    }

    private createEndEvent(bpmnNode: BpmnNode): Element {
        //add under <bpmn:process>
        var end = this.doc.createElementNS(Namespace.BPMN, Namespace.END_ELEMENT)
        end.setAttribute("id", bpmnNode.id + "_" + Random.id())
        
        this.process.appendChild(end)

        //add under diagram's <bpmndi:BPMNPlane>
        var endShape = this.doc.createElementNS(Namespace.BPMNDI, Namespace.SHAPE_ELEMENT)
        endShape.setAttribute("id", Namespace.SHAPE + "_" + bpmnNode.id + "_" + Random.id())
        endShape.setAttribute("bpmnElement", end.getAttribute("id")!)
        endShape.appendChild(this.createEventBounds(bpmnNode))

        this.plane.appendChild(endShape)

        //incoming edges
        bpmnNode.inEdges.forEach(inEdge => this.edgeExporter.createBpmnIncomingXml(inEdge, end, endShape))


        return end
    }

    private createEventBounds(bpmnNode: BpmnNode): Element {
        //<dc:Bounds x="156" y="81" width="36" height="36" />
        var bounds = this.doc.createElementNS(Namespace.DC, Namespace.BOUNDS_ELEMENT)
        bounds.setAttribute("x", Utils.withXOffset(bpmnNode.x))
        bounds.setAttribute("y", Utils.withYOffsetForEvent(bpmnNode.y))
        bounds.setAttribute("width", Constants.EVENT_DIAMETER)
        bounds.setAttribute("height", Constants.EVENT_DIAMETER)
        return bounds

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