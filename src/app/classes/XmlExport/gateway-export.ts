import { BpmnNode } from "../Basic/Bpmn/BpmnNode"
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils"
import { Constants } from "./constants"
import { Namespace } from "./namespaces"
import { Random, Utils } from "./utils"

/**
 * creates XML representation for gateways
 */
export class GatewayExporter {

    constructor(public xmlDoc: XMLDocument) {

    }

    /**
     * creates XML element <bpmn:> of corresponding gateway type under <bpmn:process>
     * @param bpmnNode 
     * @returns 
     */
    bpmnGatewayXml(bpmnNode: BpmnNode): Element {

        //add under <bpmn:process>
        let gateway = this.xmlDoc.createElementNS(Namespace.BPMN, this.getTagName(bpmnNode))
        gateway.setAttribute("id", bpmnNode.id + "_" + Random.id())

        return gateway
    }

    /**
     * creates <bpmndi:BPMNShape> element under <bpmndi:BPMNPlane>
     * @param bpmnNode 
     * @param gatewayId reference to <bpmn:> XML element under <bpmn:process>
     * @returns 
     */
    bpmnShapeXml(bpmnNode: BpmnNode, gatewayId: string): Element {

        var shape = this.xmlDoc.createElementNS(Namespace.BPMNDI, Namespace.SHAPE_ELEMENT)
        shape.setAttribute("id", Namespace.SHAPE + "_" + bpmnNode.id + "_" + Random.id())
        shape.setAttribute("bpmnElement", gatewayId)
        shape.appendChild(this.createBounds(bpmnNode))

        return shape
    }

    /**
    * creates <dc:Bounds> XML element as child of the Gateway to define its size and location
    * @param bpmnNode 
    * @returns 
    */
    private createBounds(bpmnNode: BpmnNode): Element {
        var bounds = this.xmlDoc.createElementNS(Namespace.DC, Namespace.BOUNDS_ELEMENT)
        bounds.setAttribute("x", Utils.withOffset(bpmnNode.x, Constants.X_OFFSET))
        bounds.setAttribute("y", Utils.withOffset(bpmnNode.y, Constants.Y_OFFSET_GATEWAY))
        bounds.setAttribute("width", Constants.GATEWAY_WIDTH)
        bounds.setAttribute("height", Constants.GATEWAY_HEIGHT)


        return bounds
    }

    //gateway type
    private getTagName(bpmnNode: BpmnNode): string {
        if (BpmnUtils.isAndGateway(bpmnNode))
            return Namespace.PARALLEL_GATEWAY_ELEMENT
        if (BpmnUtils.isOrGateway(bpmnNode))
            return Namespace.INCLUSIVE_GATEWAY_ELEMENT

        return Namespace.EXCLUSIVE_GATEWAY_ELEMENT
    }
}