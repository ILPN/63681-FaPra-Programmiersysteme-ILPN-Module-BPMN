import { BpmnNode } from "../Basic/Bpmn/BpmnNode"
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils"
import { BpmnEvent } from "../Basic/Bpmn/events/BpmnEvent"
import { BpmnEventEnd } from "../Basic/Bpmn/events/BpmnEventEnd"
import { BpmnEventIntermediate } from "../Basic/Bpmn/events/BpmnEventIntermediate"
import { BpmnEventStart } from "../Basic/Bpmn/events/BpmnEventStart"
import { Constants } from "./constants"
import { Exporter } from "./exporter"
import { Namespace } from "./namespaces"
import { Random, Utils } from "./utils"

/**
 * creates XML representation for events
 */
export class EventExporter extends Exporter {



    /**
     * creates XML element <bpmn:intermediateThrowEvent> under <bpmn:process>
     * @param bpmnNode 
     * @returns 
     */
    bpmnIntermEventXml(bpmnNode: BpmnEventIntermediate): Element {
        return this.createEvent(bpmnNode, Namespace.INTERMEDIATE_EVENT_ELEMENT)
    }

    /**
     * creates XML element <bpmn:endEvent> under <bpmn:process>
     * @param bpmnNode 
     * @returns 
     */
    bpmnEndEventXml(bpmnNode: BpmnEventEnd): Element {
        return this.createEvent(bpmnNode, Namespace.END_ELEMENT)
    }

    /**
     * creates XML element <bpmn:startEvent> under <bpmn:process>
     * @param bpmnNode 
     * @returns 
     */
    bpmnStartEventXml(bpmnNode: BpmnEventStart): Element {
        return this.createEvent(bpmnNode, Namespace.START_ELEMENT)
    }

    createEvent(bpmnNode: BpmnEvent, xmlTag: string): Element {
        let event = this.createElementNS(bpmnNode, Namespace.BPMN, xmlTag)

        event.setAttribute("id", Random.id() + "_" + bpmnNode.id)
        if (bpmnNode.label)
            event.setAttribute("name", bpmnNode.label)
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



}