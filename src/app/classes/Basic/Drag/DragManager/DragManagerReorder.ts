import { LeveledGraph } from "src/app/classes/Sugiyama/LeveledGraph";
import { Utility } from "src/app/classes/Utils/Utility";
import { Vector } from "src/app/classes/Utils/Vector";
import { BpmnDummyEdgeCorner } from "../../Bpmn/BpmnEdge/BpmnDummyEdgeCorner";
import { BpmnNode } from "../../Bpmn/BpmnNode";
import { Position } from "../../Interfaces/Position";

import { DragHandle } from "../DragHandle";
import { DragManager } from "./DragManager";


export class DragManagerReorder extends DragManager{
    private sugiResult:LeveledGraph
    constructor(dragingSurface:SVGElement,snapingView:SVGElement,sugiResult:LeveledGraph){
        super(dragingSurface,snapingView)
        this.sugiResult = sugiResult
    }
    private dragHandlesToReorder:DragHandle[] = []
    private setDragHandlesToReorder(dragHandle:DragHandle){
        if(!(dragHandle.dragedElement instanceof BpmnNode || dragHandle.dragedElement instanceof BpmnDummyEdgeCorner)) return
        const idOfDraggedEl = dragHandle.dragedElement.id
        const level = this.sugiResult.getNode(idOfDraggedEl)!.level

        const idsInLevel = this.sugiResult.levels[level].map(ln => ln.id)
        //console.log(idsInLevel)
        //console.log(this.dragHandles)
        for (const [a,dh] of this.dragHandles.entries()){
            if(!(a instanceof BpmnNode || a instanceof BpmnDummyEdgeCorner)) continue
            if(idsInLevel.findIndex(id => id== a.id) != -1){
                this.dragHandlesToReorder.push(dh)
            }

        }


    }
    private startPositions:Vector[] = []
    override startDrag(event: MouseEvent, dh: DragHandle): void {
        super.startDrag(event,dh)
        this.dragHandlesToReorder = []
        this.startPositions =[]
        this.setDragHandlesToReorder(dh)
        for (const dragHandle of this.dragHandlesToReorder) {
            this.startPositions.push(dragHandle.dragedElement.getPos().copy())
        }
        this.startPositions.sort((a,b)=> a.y-b.y)

        for (const dragHandle of this.dragHandlesToReorder) {
            dragHandle.startDrag(event)
        }
    }

    override drag(event: MouseEvent): void {
        super.drag(event)
        this.dragHandlesToReorder.sort((dh1,dh2)=> dh1.dragedElement.y-dh2.dragedElement.y)
        for (const [i,dragHandle] of this.dragHandlesToReorder.entries()) {
            if(dragHandle == this.dragedDragHandle) continue
            dragHandle.dragTo(this.startPositions[i])
        }
    }

    private _onStopReorderDragHandles: (dragHandlesThatChanged: DragHandle[]) => void = () => { };
    public set onStopReorderDrag(value: (dragHandlesThatChanged: DragHandle[]) => void) {
        this._onStopReorderDragHandles = value;
    }
    override stopDrag(event: MouseEvent): void {
        super.stopDrag(event)
        for (const [i,dragHandle] of this.dragHandlesToReorder.entries()) {
            dragHandle.dragTo(this.startPositions[i])
        }

        const dragHandlesThatChanged = []
        for (const dh of this.dragHandlesToReorder) {
            if(!Utility.positionsAreEqual(dh.dragedElement.getPos(), dh.startPos)){
                dragHandlesThatChanged.push(dh)
                for (const dha of dh.dragedAlong) {
                    dragHandlesThatChanged.push(dha)
                }
            }
        }

        this._onStopReorderDragHandles(dragHandlesThatChanged)
    }
}