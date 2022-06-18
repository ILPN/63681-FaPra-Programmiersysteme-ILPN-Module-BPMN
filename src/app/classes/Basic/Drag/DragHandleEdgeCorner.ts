import { BpmnEdge, BpmnEdgeCorner } from "../Bpmn/BpmnEdge";
import { DragHandle } from "./DragHandle";
import { DragWrapperGraph } from "./DragWrapperGraph";

export class DragHandleEdgeCorner extends DragHandle<BpmnEdgeCorner>{
    
    protected edge: BpmnEdge
    constructor(dragedElement:BpmnEdgeCorner,edge:BpmnEdge,dwg:DragWrapperGraph){
        super(dragedElement,dwg)
        this.edge = edge
    }
    
    override updateAffectedSvgs(): void {
        super.updateAffectedSvgs()
        this.edge.updateSvg()
    }
}