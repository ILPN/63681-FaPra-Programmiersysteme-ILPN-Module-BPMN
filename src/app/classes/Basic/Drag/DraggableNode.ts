import { BpmnNode } from "../Bpmn/BpmnNode";
import { DragHandle } from "./DragHandle";
import { DragManager } from "./DragManager/DragManager";

export class DraggableNode{
    public  node:BpmnNode
    private dwg:DragManager
    private _dragHandle: DragHandle
    public get dragHandle(): DragHandle {
        return this._dragHandle;
    }
    constructor(node:BpmnNode, dwg:DragManager){
        this.node = node
        this.node.svgManager.getNewSvg().onmousedown = (e) => this.dwg.startDrag(e,this.dragHandle)
        this.dwg = dwg
        this._dragHandle = new DragHandle(node)
        this.dragHandle.addCallbackAfterDragTo(() =>{
            this.node.svgManager.redraw()
        })
    }
}