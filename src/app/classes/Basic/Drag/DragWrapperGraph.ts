import { BpmnEdge } from "../Bpmn/BpmnEdge";
import { BpmnNode } from "../Bpmn/BpmnNode";
import { BpmnEventEnd } from "../Bpmn/events/BpmnEventEnd";
import { BpmnEventIntermediate } from "../Bpmn/events/BpmnEventIntermediate";
import { BpmnEventStart } from "../Bpmn/events/BpmnEventStart";
import { BpmnGateway } from "../Bpmn/gateways/BpmnGateway";
import { BpmnGraph } from "../BpmnGraph"
import { SvgInterface } from "../Interfaces/SvgInterface";
import { Svg } from "../Svg/Svg";
import { Dragable } from "./Dragable";
import { DragWrapperBpmnNode } from "./DragWrapperBpmnNode";
import { BDragHelper } from "./DragHelpers/BDragHelper";

export class DragWrapperGraph implements SvgInterface{
    private bpmnGraph:BpmnGraph
    constructor(bpmnGraph:BpmnGraph){
        this.bpmnGraph = bpmnGraph
    }
    updateSvg(): SVGElement {
        const c = Svg.container()
        c.appendChild(Svg.background())
        for (const n of this.bpmnGraph.nodes) {
            const dragWrapper = new DragWrapperBpmnNode<BpmnNode>(n, this)
            c.appendChild(dragWrapper.updateSvg())
        }
        for (const e of this.bpmnGraph.edges) {
            c.appendChild(e.getSvg())
        }
        return c

    }

    private dragHelper: BDragHelper | undefined;
    startDragNode(event: MouseEvent, node: DragWrapperBpmnNode<BpmnNode>) {
        this.dragHelper = new BDragHelper(node)
        this.dragHelper.startDrag(event)
    }

    drag(event: MouseEvent) {
       this.dragHelper?.dragElement(event)
    }
    stopDrag(event: MouseEvent) {
        this.dragHelper?.stopDrag()
        this.dragHelper = undefined
    }
}