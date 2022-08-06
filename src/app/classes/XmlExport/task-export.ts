import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { Constants } from "./constants";
import { Namespace } from "./namespaces";
import { Random, Utils } from "./utils";

export class TaskExporter {


    constructor(public bpmnNode: BpmnNode, public xmlDoc: XMLDocument) {

    }

    bpmnTaskXml(): Element {

        //add under <bpmn:process>
        let task = this.xmlDoc.createElementNS(Namespace.BPMN, this.getTagName())
        task.setAttribute("id", this.bpmnNode.id + "_" + Random.id())
        task.setAttribute("name", this.bpmnNode.label)

        

        return task
    }

    bpmnShapeXml(taskId: string): Element {
        //add under diagram's <bpmndi:BPMNPlane>
        var shape = this.xmlDoc.createElementNS(Namespace.BPMNDI, Namespace.SHAPE_ELEMENT)
        shape.setAttribute("id", Namespace.SHAPE + "_" + this.bpmnNode.id + "_" + Random.id())
        shape.setAttribute("bpmnElement", taskId)
        shape.appendChild(this.createBounds())

        return shape
    }

    private createBounds(): Element {
        var bounds = this.xmlDoc.createElementNS(Namespace.DC, Namespace.BOUNDS_ELEMENT)
        bounds.setAttribute("x", Utils.withXOffset(this.bpmnNode.x))
        bounds.setAttribute("y", Utils.withYOffset(this.bpmnNode.y))
        bounds.setAttribute("width", Constants.TASK_WIDTH)
        bounds.setAttribute("height", Constants.TASK_HEIGHT)


        return bounds
    }

    private getTagName(): string {
        if (BpmnUtils.isManualTask(this.bpmnNode))
            return Namespace.MANUAL_TASK_ELEMENT
        if (BpmnUtils.isServiceTask(this.bpmnNode))
            return Namespace.SERVICE_TASK_ELEMENT
        if (BpmnUtils.isUserTask(this.bpmnNode))
            return Namespace.USER_TASK_ELEMENT
        if (BpmnUtils.isReceivingTask(this.bpmnNode))
            return Namespace.RECEIVE_TASK_ELEMENT
        if (BpmnUtils.isSendingTask(this.bpmnNode))
            return Namespace.SEND_TASK_ELEMENT

        return Namespace.TASK_ELEMENT
    }
}