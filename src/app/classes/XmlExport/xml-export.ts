import { BpmnGraph } from "../Basic/Bpmn/BpmnGraph";
import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
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
    private validXml;



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

        //error handling
        this.validXml = true
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
        var xmlString = ""
        try{
            xmlString = new XMLSerializer().serializeToString(this.doc);
        }
        catch(err){
            this.error  = (err as Error).message;
        }


        return { xmlText: xmlString, ok: this.validXml, error: this.error }
    }

    private addSequenceFlowsToProcess() {
        let result = this.edgeExporter.createSequenceFlows()

        if (!result.elements)
            this.setInvalidResult(result.error)
        else
            result.elements.forEach(
                sequenceFlow => this.process.appendChild(sequenceFlow)
            )
    }

    private addBpmnEdgeXmlElementsToPlane() {

        let result = this.edgeExporter.createBpmnEdgeXmlElements()
        if (!result.elements)
            this.setInvalidResult(result.error)
        else
            result.elements.forEach(edge => this.plane.appendChild(edge))

    }

    private convertBpmnNodeToXml(bpmnNode: BpmnNode) {
        
        BpmnUtils.isStartEvent(bpmnNode) && this.createStartEvent(bpmnNode)

        BpmnUtils.isTask(bpmnNode) && this.createTask(bpmnNode)
        BpmnUtils.isEndEvent(bpmnNode) && this.createEndEvent(bpmnNode)

        BpmnUtils.isGateway(bpmnNode) && this.createGateway(bpmnNode)

        BpmnUtils.isIntermediateEvent(bpmnNode) && this.createIntermediateEvent(bpmnNode)
    }

    private createIntermediateEvent(bpmnNode: BpmnNode) {
        //<bpmn:startEvent> under <bpmn:process>
        let createIntermEventResult = this.eventExporter.bpmnEventXml(bpmnNode);
        if (createIntermEventResult.element) {
            let intermEvent = createIntermEventResult.element
            this.process.appendChild(intermEvent)

            // <bpmndi:BPMNShape> under <bpmndi:BPMNPlane>
            var eventShape = this.eventExporter.bpmnShapeXml(bpmnNode, intermEvent.getAttribute("id")!)
            this.plane.appendChild(eventShape)

            // outgoing and incoming edges as XML children of <bpmn:intermediateThrowEvent>
            bpmnNode.inEdges.forEach(inEdge => this.edgeExporter.createBpmnIncomingXml(inEdge, intermEvent, eventShape))
            bpmnNode.outEdges.forEach(outEdge => this.edgeExporter.createBpmnOutgoingXml(outEdge, intermEvent, eventShape))
        }
        //error handling
        else this.setInvalidResult(createIntermEventResult.error)
    }

    setInvalidResult(error: string) {
        {
            this.validXml = false
            this.error += error
        }
    }

    private createGateway(bpmnNode: BpmnNode) {
        let createGatewayResult = this.gatewayExporter.bpmnGatewayXml(bpmnNode);

        if (createGatewayResult.element) {
            //<bpmn:*gateway> under <bpmn:process>
            let gateway = createGatewayResult.element
            this.process.appendChild(gateway)

            // <bpmndi:BPMNShape> under <bpmndi:BPMNPlane>
            let gatewayShape = this.gatewayExporter.bpmnShapeXml(bpmnNode, gateway.getAttribute("id")!)
            this.plane.appendChild(gatewayShape)

            // edges as XML children of <bpmn:*gateway>
            bpmnNode.outEdges.forEach(outEdge => this.edgeExporter.createBpmnOutgoingXml(outEdge, gateway, gatewayShape))
            bpmnNode.inEdges.forEach(inEdge => this.edgeExporter.createBpmnIncomingXml(inEdge, gateway, gatewayShape))
        }
        //error handling
        else this.setInvalidResult(createGatewayResult.error)

    }

    private createTask(bpmnNode: BpmnNode) {
        let createTaskResult = this.taskExporter.bpmnTaskXml(bpmnNode);

        if (createTaskResult.element) {
            //<bpmn:*task> under <bpmn:process>
            let task = createTaskResult.element
            this.process.appendChild(task)

            // <bpmndi:BPMNShape> under <bpmndi:BPMNPlane>
            let taskShape = this.taskExporter.bpmnShapeXml(bpmnNode, task.getAttribute("id")!)
            this.plane.appendChild(taskShape)

            // edges as XML children of <bpmn:*task>

            bpmnNode.outEdges.forEach(outEdge => this.edgeExporter.createBpmnOutgoingXml(outEdge, task, taskShape))
            bpmnNode.inEdges.forEach(inEdge => this.edgeExporter.createBpmnIncomingXml(inEdge, task, taskShape))
        }
        //error handling
        else this.setInvalidResult(createTaskResult.error)

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

    private createStartEvent(bpmnNode: BpmnNode) {
        
        let createStartResult = this.eventExporter.bpmnEventXml(bpmnNode);

        if (createStartResult.element) {
            //<bpmn:startEvent> under <bpmn:process>
            let start = createStartResult.element
            this.process.appendChild(start)

            // <bpmndi:BPMNShape> under <bpmndi:BPMNPlane>
            var startShape = this.eventExporter.bpmnShapeXml(bpmnNode, start.getAttribute("id")!)
            this.plane.appendChild(startShape)

            // outgoing edges as XML children of <bpmn:startEvent>
            bpmnNode.outEdges.forEach(outEdge => this.edgeExporter.createBpmnOutgoingXml(outEdge, start, startShape))
        }
        //error handling
        else this.setInvalidResult(createStartResult.error)
    }

    private createEndEvent(bpmnNode: BpmnNode) {
        let createEndResult = this.eventExporter.bpmnEventXml(bpmnNode);
        if (createEndResult.element) {
            //<bpmn:endEvent> under <bpmn:process>
            let end = createEndResult.element
            this.process.appendChild(end)

            // <bpmndi:BPMNShape> under <bpmndi:BPMNPlane>
            var endShape = this.eventExporter.bpmnShapeXml(bpmnNode, end.getAttribute("id")!)
            this.plane.appendChild(endShape)

            //incoming edges as XML children of <bpmn:endEvent>
            bpmnNode.inEdges.forEach(inEdge => this.edgeExporter.createBpmnIncomingXml(inEdge, end, endShape))
        }


        //error handling
        else this.setInvalidResult(createEndResult.error)
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
            this.setInvalidResult(" Element bpmndi:BPMNPlane konnte nicht erstellt werden, weil Element bpmn:process keine ID hat. ")
        diagram.appendChild(plane);

        return plane
    }
}