import { BpmnNode } from "../Bpmn/BpmnNode";
import { DragHandle } from "./DragHandle";
import { DraggableGraph } from "./DraggableGraph";

export class DraggableNode{
    public  node:BpmnNode
    private dwg:DraggableGraph
    private _dragHandle: DragHandle
    public get dragHandle(): DragHandle {
        return this._dragHandle;
    }
    constructor(node:BpmnNode, dwg:DraggableGraph){
        this.node = node
        this.node.svgManager.getSvg().onmousedown = (e) => this.dwg.startDrag(e,this.dragHandle)
        this.dwg = dwg
        this._dragHandle = new DragHandle(node)
        this.dragHandle.addCallbackAfterDragTo(() =>{
            this.node.svgManager.redraw()
        })
    }
}