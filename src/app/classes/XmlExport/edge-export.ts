import { BpmnEdge } from "../Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { Constants } from "./constants";
import { Edge } from "./edge";
import { Exporter } from "./exporter";
import { Namespace } from "./namespaces";
import { Random } from "./utils";

/**
 * creates XML representation for edges
 */
export class EdgeExporter extends Exporter {
    edges: Array<Edge> = new Array<Edge>()
    private ERROR_START = " Fehler beim Erstellen von XML elements für BPMN Edge: "
    private NO_SOURCE_ELEMENT_ERR = this.ERROR_START + " Ausgangselement bpmn: fehlt. ID: "
    private NO_SOURCE_SHAPE_ERR = this.ERROR_START + " Ausgangselement bpmndi:BPMNShape fehlt. ID: "
    private NO_TARGET_ELEMENT_ERR = this.ERROR_START + " Eingangselement bpmn: fehlt. ID: "
    private NO_TARGET_SHAPE_ERR = this.ERROR_START + " Eingangselement bpmndi:BPMNShape fehlt. ID: "
    private NO_COORD_SOURCE_ERR = this.ERROR_START + " Ausgangselement bpmndi:BPMNShape hat keine Koordinaten. ID: "
    private NO_COORD_TARGET_ERR = this.ERROR_START + " Eingangselement bpmndi:BPMNShape hat keine Koordinaten. ID: "


    /**
     * creates <bpmn:outgoing> element to represent outgoing edge of an element
     * @param bpmnEdge outgoing edge
     * @param sourceElement XML element <bpmn:> from which the edge starts
     * @param sourceShape XML element <bpmndi:BPMNShape> from which the edge starts
     * @returns XML element as a child of sourceElement under <bpmn:process>
     */
    createBpmnOutgoingXml(bpmnEdge: BpmnEdge, sourceElement: Element, sourceShape: Element): { element: Element | null, error: string } {
        console.log("Edge id " + bpmnEdge.id + " from " + bpmnEdge.from.label + " to " + bpmnEdge.to.label)
        if (!sourceElement)
            return { element: null, error: this.NO_SOURCE_ELEMENT_ERR + bpmnEdge.id}

        if (!sourceShape)
            return { element: null, error: this.NO_SOURCE_SHAPE_ERR + bpmnEdge.id}

        let edge = this.createNewEdgeIfNotExists(bpmnEdge)
        edge.sourceShape = sourceShape
        edge.sourceElement = sourceElement

        //XML element under a child of sourceElement under <bpmn:process>
        let outEdgeXml = this.xmlDoc.createElementNS(Namespace.BPMN, Namespace.OUTGOING_ELEMENT)
        outEdgeXml.innerHTML = edge.id
        sourceElement.appendChild(outEdgeXml)
        return { element: outEdgeXml, error: "" }
    }

    /**
     * checks if the edge has already been added and creates new if not
     * @param bpmnEdge 
     * @returns 
     */
    createNewEdgeIfNotExists(bpmnEdge: BpmnEdge): Edge {
        for (let edge of this.edges)
            if (edge.bpmnEdge === bpmnEdge)
                return edge

        let newEdge = new Edge(bpmnEdge, bpmnEdge.id + "_" + Random.id())
        this.edges.push(newEdge)

        return newEdge
    }

    /**
     * creates <bpmn:incoming> element to represent incoming edge of an element
     * @param bpmnEdge incoming edge
     * @param sourceElement XML element <bpmn:> to which the edge leads
     * @param sourceShape XML element <bpmndi:BPMNShape> to which the edge leads
     * @returns XML element under a child of targetElement under <bpmn:process>
     */
    createBpmnIncomingXml(bpmnEdge: BpmnEdge, targetElement: Element, targetShape: Element): { element: Element | null, error: string } {
        if (!targetElement)
            return { element: null, error: this.NO_TARGET_ELEMENT_ERR + bpmnEdge.id}

        if (!targetShape)
            return { element: null, error: this.NO_TARGET_SHAPE_ERR + bpmnEdge.id}

        let edge = this.createNewEdgeIfNotExists(bpmnEdge)
        edge.targetShape = targetShape
        edge.targetElement = targetElement

        //XML element under a child of targetElement under <bpmn:process>
        let inEdgeXml = this.xmlDoc.createElementNS(Namespace.BPMN, Namespace.INCOMING_ELEMENT)
        inEdgeXml.innerHTML = edge.id
        targetElement.appendChild(inEdgeXml)
        return { element: inEdgeXml, error: "" }
    }

    /**
     * for every edge creates <bpmndi:BPMNEdge> element under <bpmndi:BPMNPlane> 
     * and references the corresponding <bpmn:> XML element under <bpmn:process>
     * @returns list of XML elements <bpmndi:BPMNEdge>
     */
    createBpmnEdgeXmlElements(): { elements: Array<Element> | null, error: string } {
        let elementsList = new Array<Element>();

        for (let edge of this.edges) {
            let bpmnEdgeXml = this.xmlDoc.createElementNS(Namespace.BPMNDI, Namespace.EDGE_ELEMENT)
            bpmnEdgeXml.setAttribute("id", Namespace.FLOW + "_" + edge.id + "_di")
            bpmnEdgeXml.setAttribute("bpmnElement", edge.id)

            //coordinates as waypoint child elements

            //start
            let createEdgeStart = this.createWayPointForEdgeStart(edge)
            if (!createEdgeStart.element)
                return { elements: null, error: createEdgeStart.error }
            bpmnEdgeXml.appendChild(createEdgeStart.element)


            //end
            let createEdgeEnd = this.createWayPointForEdgeEnd(edge)
            if (!createEdgeEnd.element)
                return { elements: null, error: createEdgeEnd.error }
            bpmnEdgeXml.appendChild(createEdgeEnd.element)

            elementsList.push(bpmnEdgeXml)

        }
        return { elements: elementsList, error: "" }
    }

    /**
     * calculates coordinates of edge starting point
     * @param edge 
     * @returns <di:waypoint> XML element representing the coordinates
     */
    createWayPointForEdgeStart(edge: Edge): { element: Element | null, error: string } {
        //x and y coordinates of source element (BPMNShape) are specified in its child element Bounds

        //check errors
        let coord_result_x = this.getCoordinateSource("x", edge)
        if (!coord_result_x.coordinate)
            return { element: null, error: coord_result_x.error }

        let coord_result_y = this.getCoordinateSource("y", edge)
        if (!coord_result_y.coordinate)
            return { element: null, error: coord_result_y.error }

        var startPoint = this.xmlDoc.createElementNS(Namespace.DI, Namespace.WAYPOINT_ELEMENT)

        //x coordinate is calculated as (x of source shape + offset)
        //offset is half width of task or radius of event
        let x = parseInt(coord_result_x.coordinate) + this.getXoffset(edge.bpmnEdge.from)
        startPoint.setAttribute("x", x.toString())

        //y = half height of task or radius of event
        let y = parseInt(coord_result_y.coordinate) + this.getYoffset(edge.bpmnEdge.from)
        startPoint.setAttribute("y", y.toString())

        return { element: startPoint, error: "" }
    }

    private getCoordinateSource(coord: string, edge: Edge): { coordinate: string | null, error: string } {
        let edgeSourceShape = edge.sourceShape
        if (!edgeSourceShape)
            return { coordinate: null, error: this.NO_COORD_SOURCE_ERR + edge.bpmnEdge.id}


        let boundsElement = edgeSourceShape.children.item(0)
        if (!boundsElement)
            return { coordinate: null, error: this.NO_COORD_SOURCE_ERR + edge.bpmnEdge.id}

        let coordValue = boundsElement.getAttribute(coord)
        if (!coord)
            return { coordinate: null, error: this.NO_COORD_SOURCE_ERR + edge.bpmnEdge.id}

        return { coordinate: coordValue, error: "" }
    }

    private getCoordinateTarget(coord: string, edge: Edge): { coordinate: string | null, error: string } {
        let edgeTargetShape = edge.targetShape
        if (!edgeTargetShape)
            return { coordinate: null, error: this.NO_COORD_TARGET_ERR + edge.bpmnEdge.id}


        let boundsElement = edgeTargetShape.children.item(0)
        if (!boundsElement)
            return { coordinate: null, error: this.NO_COORD_TARGET_ERR + edge.bpmnEdge.id}

        let coordValue = boundsElement.getAttribute(coord)
        if (!coord)
            return { coordinate: null, error: this.NO_COORD_TARGET_ERR + edge.bpmnEdge.id}

        return { coordinate: coordValue, error: "" }
    }

    //for calculating edge coordinates
    private getYoffset(bpmnNode: BpmnNode): number {
        if (BpmnUtils.isTask(bpmnNode))
            return parseInt(Constants.TASK_HEIGHT) / 2

        if (BpmnUtils.isGateway(bpmnNode))
            return parseInt(Constants.GATEWAY_HEIGHT) / 2

        return parseInt(Constants.EVENT_DIAMETER) / 2

    }

    //for calculating edge coordinates
    private getXoffset(bpmnNode: BpmnNode): number {
        if (BpmnUtils.isTask(bpmnNode))
            return parseInt(Constants.TASK_WIDTH)

        return parseInt(Constants.EVENT_DIAMETER)

    }

    /**
    * calculates coordinates of edge end point
    * @param edge 
    * @returns <di:waypoint> XML element representing the coordinates
    */
    createWayPointForEdgeEnd(edge: Edge): { element: Element | null, error: string } {
        //x and y coordinates of source element (BPMNShape) are specified in its child element Bounds

        //check errors
        let coord_result_x = this.getCoordinateTarget("x", edge)
        if (!coord_result_x.coordinate)
            return { element: null, error: coord_result_x.error }

        let coord_result_y = this.getCoordinateTarget("y", edge)
        if (!coord_result_y.coordinate)
            return { element: null, error: coord_result_y.error }


        var endPoint = this.xmlDoc.createElementNS(Namespace.DI, Namespace.WAYPOINT_ELEMENT)

        //x
        endPoint.setAttribute("x", coord_result_x.coordinate)

        //y = half height of task
        let y = parseInt(coord_result_y.coordinate) + this.getYoffset(edge.bpmnEdge.to)
        endPoint.setAttribute("y", y.toString())

        return { element: endPoint, error: "" }
    }

    /**
     * for each edge creates <bpmn:sequenceFlow> XML element under <bpmn:process>
     * @returns a list of <bpmn:sequenceFlow> XML elements
     */
    createSequenceFlows(): { elements: Array<Element> | null, error: string } {
        let elementsList = new Array<Element>();

        for (let edge of this.edges) {
            let seqFlowXml = this.xmlDoc.createElementNS(Namespace.BPMN, Namespace.SEQUENCE_FLOW_ELEMENT)
            seqFlowXml.setAttribute("id", edge.id)

            //set source reference
            let result = this.setSourceRef(seqFlowXml, edge)
            if (result.error)
                return { elements: null, error: result.error }


            //set target reference
            result = this.setTargetRef(seqFlowXml, edge)
            if (result.error)
                return { elements: null, error: result.error }

            elementsList.push(seqFlowXml)

        }

        return { elements: elementsList, error: "" }
    }

    setSourceRef(seqFlowXml: Element, edge: Edge): { error: string | null } {
        if (!edge.sourceElement)
            return { error: this.NO_SOURCE_ELEMENT_ERR }

        let id = edge.sourceElement.getAttribute("id")
        if (!id)
            return { error: this.NO_SOURCE_ELEMENT_ERR }

        seqFlowXml.setAttribute("sourceRef", id)

        return { error: null }

    }

    setTargetRef(seqFlowXml: Element, edge: Edge): { error: string | null } {
        if (!edge.targetElement)
            return { error: this.NO_TARGET_ELEMENT_ERR }

        let id = edge.targetElement.getAttribute("id")
        if (!id)
            return { error: this.NO_TARGET_ELEMENT_ERR }

        seqFlowXml.setAttribute("targetRef", id)

        return { error: null }

    }


}