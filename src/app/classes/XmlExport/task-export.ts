import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { Constants } from "./constants";
import { Exporter } from "./exporter";
import { Namespace } from "./namespaces";
import { Random, Utils } from "./utils";

/**
 * creates XML representation for tasks
 */
export class TaskExporter extends Exporter {


    /**
     * creates XML element <bpmn:> for the task under <bpmn:process>
     * @param bpmnNode 
     * @returns 
     */
    bpmnTaskXml(bpmnNode: BpmnNode): { element: Element | null, error: string } {

        //add under <bpmn:process>
        let createTaskResult = this.createElementNS(bpmnNode, Namespace.BPMN, this.getTagName(bpmnNode))

        if (createTaskResult.element) {
            let task = createTaskResult.element
            task.setAttribute("id", bpmnNode.id + "_" + Random.id())
            task.setAttribute("name", bpmnNode.label)

            return { element: task, error: "" }
        }

        return { element: null, error: createTaskResult.error }
    }

    /**
     * creates <bpmndi:BPMNShape> element under <bpmndi:BPMNPlane>
     * @param bpmnNode 
     * @param eventId reference to <bpmn:> XML element under <bpmn:process>
     * @returns 
     */
    bpmnShapeXml(bpmnNode: BpmnNode, taskId: string): Element {
        //add under diagram's <bpmndi:BPMNPlane>
        var shape = this.xmlDoc.createElementNS(Namespace.BPMNDI, Namespace.SHAPE_ELEMENT)
        shape.setAttribute("id", Namespace.SHAPE + "_" + bpmnNode.id + "_" + Random.id())
        shape.setAttribute("bpmnElement", taskId)
        shape.appendChild(this.createBounds(bpmnNode))

        return shape
    }

    /**
    * creates <dc:Bounds> XML element as child of the Task to define its size and location
    * @param bpmnNode 
    * @returns 
    */
    private createBounds(bpmnNode: BpmnNode): Element {
        var bounds = this.xmlDoc.createElementNS(Namespace.DC, Namespace.BOUNDS_ELEMENT)
        bounds.setAttribute("x", Utils.withOffset(bpmnNode.x, Constants.X_OFFSET))
        bounds.setAttribute("y", Utils.withOffset(bpmnNode.y, Constants.Y_OFFSET))
        bounds.setAttribute("width", Constants.TASK_WIDTH)
        bounds.setAttribute("height", Constants.TASK_HEIGHT)


        return bounds
    }

    //task type
    private getTagName(bpmnNode: BpmnNode): string | undefined {
        if (BpmnUtils.isManualTask(bpmnNode))
            return Namespace.MANUAL_TASK_ELEMENT
        if (BpmnUtils.isServiceTask(bpmnNode))
            return Namespace.SERVICE_TASK_ELEMENT
        if (BpmnUtils.isUserTask(bpmnNode))
            return Namespace.USER_TASK_ELEMENT
        if (BpmnUtils.isReceivingTask(bpmnNode))
            return Namespace.RECEIVE_TASK_ELEMENT
        if (BpmnUtils.isSendingTask(bpmnNode))
            return Namespace.SEND_TASK_ELEMENT

        return undefined
    }
}