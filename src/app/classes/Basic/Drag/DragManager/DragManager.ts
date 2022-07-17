import { DragHandle } from "../DragHandle";

export class DragManager{
    protected dragHandles: Map<any,DragHandle> = new Map() // homeless dragHandles
    protected dragedDragHandle: DragHandle | undefined;
    private snapingView:SVGElement 

    constructor(dragingSurface:SVGElement, snapingView:SVGElement){
        dragingSurface.onmouseup = (event) => this.stopDrag(event);
        dragingSurface.onmousemove = (event) => this.drag(event);
        this.snapingView = snapingView
    }

    registerDragHandle(obj:any,dragHandle:DragHandle){
        this.dragHandles.set(obj,dragHandle)
    }
    startDragWithObj(event:MouseEvent,obj:any){
        const dragHandle = this.dragHandles.get(obj)
        if(dragHandle == undefined){
            console.log("sorry couldn t find a dragHandle for that obj")
            return
        }
        this.startDrag(event,dragHandle)
    }
    startDrag(event: MouseEvent, dh: DragHandle ) {
        this.dragedDragHandle = dh;
        this.dragedDragHandle.startDrag(event);
        this.snapingView.appendChild(dh.getSnapSvg());
    }
    drag(event: MouseEvent) {
        this.dragedDragHandle?.draging(event);
    }
    private _onStopDrag: (dh: DragHandle) => void = () => { };
    public set onStopDrag(value: (dh: DragHandle) => void) {
        this._onStopDrag = value;
    }
    stopDrag(event: MouseEvent) {
        if(this.dragedDragHandle != undefined){
            this.dragedDragHandle.stopDrag();
            this._onStopDrag(this.dragedDragHandle)
        }
        this.dragedDragHandle = undefined;
    }
}