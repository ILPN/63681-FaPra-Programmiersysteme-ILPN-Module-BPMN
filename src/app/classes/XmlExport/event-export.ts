import { BpmnNode } from "../Basic/Bpmn/BpmnNode"
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils"
import { Constants } from "./constants"
import { Namespace } from "./namespaces"
import { Random, Utils } from "./utils"

/**
 * creates XML representation for events
 */
export class EventExporter {

    constructor(public xmlDoc: XMLDocument) {

    }

    /**
     * creates XML element <bpmn:startEvent> or <bpmn:endEvent> under <bpmn:process>
     * @param bpmnNode 
     * @returns 
     */
    bpmnEventXml(bpmnNode: BpmnNode): Element {

        let event = this.xmlDoc.createElementNS(Namespace.BPMN, this.getTagName(bpmnNode))
        event.setAttribute("id", bpmnNode.id + "_" + Random.id())

        return event
    }

    /**
     * creates <bpmndi:BPMNShape> element under <bpmndi:BPMNPlane>
     * @param bpmnNode 
     * @param eventId reference to <bpmn:> XML element under <bpmn:process>
     * @returns 
     */
    bpmnShapeXml(bpmnNode: BpmnNode, eventId: string): Element {

        let shape = this.xmlDoc.createElementNS(Namespace.BPMNDI, Namespace.SHAPE_ELEMENT)
        shape.setAttribute("id", Namespace.SHAPE + "_" + bpmnNode.id + "_" + Random.id())
        shape.setAttribute("bpmnElement", eventId)
        shape.appendChild(this.createEventBounds(bpmnNode))

        return shape
    }

    /**
     * creates <dc:Bounds> XML element as child of the Event to define its size and location
     * @param bpmnNode 
     * @returns 
     */
    private createEventBounds(bpmnNode: BpmnNode): Element {
        
        var bounds = this.xmlDoc.createElementNS(Namespace.DC, Namespace.BOUNDS_ELEMENT)
        bounds.setAttribute("x", Utils.withOffset(bpmnNode.x, Constants.X_OFFSET))
        bounds.setAttribute("y", Utils.withOffset(bpmnNode.y, Constants.Y_OFFSET_EVENT))
        bounds.setAttribute("width", Constants.EVENT_DIAMETER)
        bounds.setAttribute("height", Constants.EVENT_DIAMETER)
        return bounds

    }

    //type of event
    private getTagName(bpmnNode: BpmnNode): string {
        if (BpmnUtils.isStartEvent(bpmnNode))
            return Namespace.START_ELEMENT
        return Namespace.END_ELEMENT
    }
}