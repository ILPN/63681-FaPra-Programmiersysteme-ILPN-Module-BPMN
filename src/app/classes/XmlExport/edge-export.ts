import { BpmnEdge } from "../Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { Constants } from "./constants";
import { Edge } from "./edge";
import { Namespace } from "./namespaces";
import { Random } from "./utils";

export class EdgeExporter {
    edges: Array<Edge> = new Array<Edge>()
    constructor(public xmlDoc: XMLDocument) {

    }


    createBpmnOutgoingXml(bpmnEdge: BpmnEdge, sourceElement: Element, sourceShape: Element): Element {
        let edge = this.createNewEdgeIfNotExists(bpmnEdge)
        edge.sourceShape = sourceShape
        edge.sourceElement = sourceElement
        let outEdgeXml = this.xmlDoc.createElementNS(Namespace.BPMN, Namespace.OUTGOING_ELEMENT)
        outEdgeXml.innerHTML = edge.id
        sourceElement.appendChild(outEdgeXml)
        return outEdgeXml
    }

    createNewEdgeIfNotExists(bpmnEdge: BpmnEdge): Edge {
        for (let edge of this.edges)
            if (edge.bpmnEdge === bpmnEdge)
                return edge

        let newEdge = new Edge(bpmnEdge, bpmnEdge.id + "_" + Random.id())
        this.edges.push(newEdge)

        return newEdge
    }

    createBpmnIncomingXml(bpmnEdge: BpmnEdge, targetElement: Element, targetShape: Element): Element {
        let edge = this.createNewEdgeIfNotExists(bpmnEdge)
        edge.targetShape = targetShape
        edge.targetElement = targetElement
        let inEdgeXml = this.xmlDoc.createElementNS(Namespace.BPMN, Namespace.INCOMING_ELEMENT)
        inEdgeXml.innerHTML = edge.id
        targetElement.appendChild(inEdgeXml)
        return inEdgeXml
    }

    createBpmnEdgeXmlElements(): Array<Element> {
        let elements = new Array<Element>();

        for (let edge of this.edges) {
            let bpmnEdgeXml = this.xmlDoc.createElementNS(Namespace.BPMNDI, Namespace.EDGE_ELEMENT)
            bpmnEdgeXml.setAttribute("id", Namespace.FLOW + "_" + edge.id + "_di")
            bpmnEdgeXml.setAttribute("bpmnElement", edge.id)

            //coordinates as waypoint child elements
            let edgeStart = this.createWayPointForEdgeStart(edge)
            bpmnEdgeXml.appendChild(edgeStart)
            
            bpmnEdgeXml.appendChild(this.createWayPointForEdgeEnd(edge))

            elements.push(bpmnEdgeXml)

        }
        return elements
    }


    createWayPointForEdgeStart(edge: Edge): Element {


        var startPoint = this.xmlDoc.createElementNS(Namespace.DI, Namespace.WAYPOINT_ELEMENT)

        //x coordinate is (x of source element + offset)
        //x coordinate of source element (BPMNShape) is specified in its child element Bounds
        //offset is half width of task or radius of event
        let sourceShape = edge.sourceShape!.children.item(0)!
        let x = parseInt(sourceShape.getAttribute("x")!) + this.getXoffset(edge.bpmnEdge.from)
        startPoint.setAttribute("x", x.toString())

        //y = half height of task or radius of event
        let y = parseInt(sourceShape.getAttribute("y")!) + this.getYoffset(edge.bpmnEdge.from)
        startPoint.setAttribute("y", y.toString())

        return startPoint
    }
    private getYoffset(bpmnNode: BpmnNode): number {
        if (BpmnUtils.isTask(bpmnNode))
            return parseInt(Constants.TASK_HEIGHT) / 2

        return parseInt(Constants.EVENT_DIAMETER) / 2

    }
    private getXoffset(bpmnNode: BpmnNode): number {
        if (BpmnUtils.isTask(bpmnNode))
            return parseInt(Constants.TASK_WIDTH)

        return parseInt(Constants.EVENT_DIAMETER)

    }

    createWayPointForEdgeEnd(edge: Edge): Element {
        var endPoint = this.xmlDoc.createElementNS(Namespace.DI, Namespace.WAYPOINT_ELEMENT)

        //x coordinate is (x of target element - offset)
        //x coordinate of target element (BPMNShape) is specified in its child element Bounds
        //offset is half width of task or radius of event
        let targetShape = edge.targetShape!.children.item(0)!
        let x = parseInt(targetShape.getAttribute("x")!)
        endPoint.setAttribute("x", x.toString())

        //y = half height of task
        let y = parseInt(targetShape.getAttribute("y")!) + this.getYoffset(edge.bpmnEdge.to)
        endPoint.setAttribute("y", y.toString())

        return endPoint
    }

    createSequenceFlows(): Array<Element> {
        let elements = new Array<Element>();

        for (let edge of this.edges) {
            let seqFlowXml = this.xmlDoc.createElementNS(Namespace.BPMN, Namespace.SEQUENCE_FLOW_ELEMENT)
            seqFlowXml.setAttribute("id", edge.id)
            seqFlowXml.setAttribute("sourceRef", edge.sourceElement?.getAttribute("id")!)
            seqFlowXml.setAttribute("targetRef", edge.targetElement?.getAttribute("id")!)

            elements.push(seqFlowXml)

        }

        return elements
    }


}