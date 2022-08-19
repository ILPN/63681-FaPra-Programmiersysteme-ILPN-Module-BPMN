import { BpmnGraph } from "../Basic/Bpmn/BpmnGraph";
import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { BpmnEventEnd } from "../Basic/Bpmn/events/BpmnEventEnd";
import { BpmnEventIntermediate } from "../Basic/Bpmn/events/BpmnEventIntermediate";
import { BpmnEventStart } from "../Basic/Bpmn/events/BpmnEventStart";
import { BpmnGateway } from "../Basic/Bpmn/gateways/BpmnGateway";
import { BpmnTask } from "../Basic/Bpmn/tasks/BpmnTask";
import { EdgeExporter } from "./edge-export";
import { EventExporter } from "./event-export";
import { GatewayExporter } from "./gateway-export";
import { Namespace } from "./namespaces";
import { TaskExporter } from "./task-export";

/**
 * creates XML representation for BPMN graph
 */
export class XmlExporter {
    private doc: XMLDocument;
    private process: Element; //<bpmn:process>
    private plane: Element; //<bpmndi:BPMNPlane>
    private header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"

    //helpers
    private edgeExporter: EdgeExporter
    private taskExporter: TaskExporter
    private gatewayExporter: GatewayExporter
    private eventExporter: EventExporter

    //for error handling - collects all errors 
    private error = ""



    /**
     * converts BPMN Graph into XML BPMN 2.0
     * @param bpmnGraph 
     * @returns XML as string
     */
    static exportBpmnAsXml(bpmnGraph: BpmnGraph): { xmlText: string | null, ok: boolean, error: string } {
        return new XmlExporter().generateXml(bpmnGraph)
    }

    constructor() {

        //XML document with parent elements
        this.doc = document.implementation.createDocument("", "", null);
        let definitions = this.createBpmnDefinitions()
        this.process = this.createBpmnProcess(definitions);
        let diagram = this.createBpmnDiagram(definitions)
        this.plane = this.createBpmnPlane(diagram)

        //helpers
        this.edgeExporter = new EdgeExporter(this.doc)
        this.taskExporter = new TaskExporter(this.doc)
        this.gatewayExporter = new GatewayExporter(this.doc)
        this.eventExporter = new EventExporter(this.doc)

    }

    /**
     * converts BPMN Graph into XML BPMN 2.0
     * @param bpmnGraph 
     * @returns XML as string
     */
    generateXml(bpmnGraph: BpmnGraph): { xmlText: string | null, ok: boolean, error: string } {

        //convert BPMN elements into XML tree 
        bpmnGraph.nodes.forEach(node => this.convertBpmnNodeToXml(node))

        //create <bpmndi:BPMNEdge> elements (children of <bpmndi:BPMNPlane>)
        //at this point the coordinates of all elements are known so we can calculate the coordinates of edges
        this.addBpmnEdgeXmlElementsToPlane()


        //create <bpmn:sequenceFlow>    elements (children of <bpmn:process>)
        //at this point the ids of all elements are set so we can create sequence flows
        this.addSequenceFlowsToProcess()


        //check if there were errors during XML generation
        let xmlString = ""
        let valid;
        try {
            xmlString = new XMLSerializer().serializeToString(this.doc);
            valid = true
        }
        catch (err) {
            valid = false
            this.error = (err as Error).message;
        }

        return { xmlText: xmlString, ok: valid, error: this.error }
    }

    private addSequenceFlowsToProcess() {
        let result = this.edgeExporter.createSequenceFlows()

        result.elements.forEach(
            sequenceFlow => this.process.appendChild(sequenceFlow)
        )
        this.error += result.errors
    }

    private addBpmnEdgeXmlElementsToPlane() {

        let result = this.edgeExporter.createBpmnEdgeXmlElements()

        result.elements.forEach(edge => this.plane.appendChild(edge))
        this.error += result.errors

    }

    private convertBpmnNodeToXml(bpmnNode: BpmnNode) {

        BpmnUtils.isStartEvent(bpmnNode) && this.createStartEvent(bpmnNode as BpmnEventStart)

        BpmnUtils.isTask(bpmnNode) && this.createTask(bpmnNode as BpmnTask)
        BpmnUtils.isEndEvent(bpmnNode) && this.createEndEvent(bpmnNode as BpmnEventEnd)

        BpmnUtils.isGateway(bpmnNode) && this.createGateway(bpmnNode as BpmnGateway)

        BpmnUtils.isIntermediateEvent(bpmnNode) && this.createIntermediateEvent(bpmnNode as BpmnEventIntermediate)
    }

    private createIntermediateEvent(bpmnNode: BpmnEventIntermediate) {
        //<bpmn:startEvent> under <bpmn:process>
        let intermEvent = this.eventExporter.bpmnIntermEventXml(bpmnNode);

        this.appendEvent(intermEvent, bpmnNode)
    }


    private createGateway(bpmnNode: BpmnGateway) {
        //<bpmn:*gateway> under <bpmn:process>
        let gateway = this.gatewayExporter.bpmnGatewayXml(bpmnNode);

        this.process.appendChild(gateway)

        // <bpmndi:BPMNShape> under <bpmndi:BPMNPlane>
        let gatewayShape = this.gatewayExporter.bpmnShapeXml(bpmnNode, gateway.getAttribute("id")!)
        this.plane.appendChild(gatewayShape)

        // edges as <bpmn:outgoing> and <bpmn:incoming> children of <bpmn:*gateway>
        this.appendEdgesAsChildren(bpmnNode, gateway, gatewayShape)
    }

    private createTask(bpmnNode: BpmnTask) {
        //<bpmn:*task> under <bpmn:process>
        let task = this.taskExporter.bpmnTaskXml(bpmnNode);

        this.process.appendChild(task)

        // <bpmndi:BPMNShape> under <bpmndi:BPMNPlane>
        let taskShape = this.taskExporter.bpmnShapeXml(bpmnNode, task.getAttribute("id")!)
        this.plane.appendChild(taskShape)

        // edges as <bpmn:outgoing> and <bpmn:incoming> children of <bpmn:*task>
        this.appendEdgesAsChildren(bpmnNode, task, taskShape)

    }

    private appendEdgesAsChildren(bpmnNode: BpmnNode, element: Element, shape: Element) {
        bpmnNode.outEdges.forEach(outEdge => this.error += this.edgeExporter.createBpmnOutgoingXml(outEdge, element, shape).error)
        bpmnNode.inEdges.forEach(inEdge => this.error += this.edgeExporter.createBpmnIncomingXml(inEdge, element, shape).error)
    }

    //<bpmn:definitions>
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

    private appendEvent(event: Element, bpmnNode: BpmnNode) {
        //<bpmn:*event> under <bpmn:process>

        this.process.appendChild(event)

        // <bpmndi:BPMNShape> under <bpmndi:BPMNPlane>
        var eventShape = this.eventExporter.bpmnShapeXml(bpmnNode, event.getAttribute("id")!)
        this.plane.appendChild(eventShape)

        // edges as <bpmn:outgoing> and <bpmn:incoming> children of <bpmn:*event>
        this.appendEdgesAsChildren(bpmnNode, event, eventShape)

    }

    private createStartEvent(bpmnNode: BpmnEventStart) {      //<bpmn:endEvent> under <bpmn:process>
        let start = this.eventExporter.bpmnStartEventXml(bpmnNode);

        this.appendEvent(start, bpmnNode)

    }

    private createEndEvent(bpmnNode: BpmnEventEnd) {
        //<bpmn:endEvent> under <bpmn:process>
        let end = this.eventExporter.bpmnEndEventXml(bpmnNode);

        this.appendEvent(end, bpmnNode)

    }

    //<bpmn:process>
    private createBpmnProcess(definitions: Element): Element {

        var process = this.doc.createElementNS(Namespace.BPMN, Namespace.PROCESS_ELEMENT)
        process.setAttribute("id", Namespace.PROCESS_ID)
        definitions.appendChild(process);

        return process
    }

    //<bpmndi:BPMNDiagram
    private createBpmnDiagram(definitions: Element): Element {
        var diagram = this.doc.createElementNS(Namespace.BPMNDI, Namespace.DIAGRAM_ELEMENT)
        diagram.setAttribute("id", Namespace.DIAGRAM_ID)
        definitions.appendChild(diagram);

        return diagram
    }

    //<bpmndi:BPMNPlane>
    private createBpmnPlane(diagram: Element): Element {
        var plane = this.doc.createElementNS(Namespace.BPMNDI, Namespace.PLANE_ELEMENT)
        plane.setAttribute("id", Namespace.PLANE_ID)

        let processId = this.process.getAttribute("id")
        if (processId)
            plane.setAttribute("bpmnElement", processId)
        else
            this.error += " Element bpmndi:BPMNPlane konnte nicht erstellt werden, weil Element bpmn:process keine ID hat. "
        diagram.appendChild(plane);

        return plane
    }
}