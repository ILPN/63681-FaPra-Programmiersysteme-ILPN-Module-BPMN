import { identity } from "rxjs";
import { Vector } from "src/app/classes/Utils/Vector";
import { DragHandle } from "../DragHandle";

export class DragManager{
    protected dragHandles: Map<any,DragHandle> = new Map() // homeless dragHandles
    protected dragedDragHandle: DragHandle | undefined;
    private snapingView:SVGElement
    private svgWithViewport: SVGGraphicsElement

    constructor(dragingSurface:SVGElement, snapingView:SVGElement, svgWithViewport:SVGGraphicsElement){
        dragingSurface.onmouseup = (event) => this.stopDrag(event);
        dragingSurface.onmousemove = (event) => this.drag(event);
        this.snapingView = snapingView
        this.svgWithViewport = svgWithViewport
    }
    private _onStopDrag: (dh: DragHandle) => void = () => { };
    public set onStopDrag(value: (dh: DragHandle) => void) {
        this._onStopDrag = value;
    }
    registerDragHandle(obj:any,dragHandle:DragHandle){
        this.dragHandles.set(obj,dragHandle)
    }
    startDragWithObj(event:MouseEvent,obj:any){
        const dragHandle = this.dragHandles.get(obj)
        if(dragHandle == undefined){
            console.log("sorry couldn't find a dragHandle for obj: "+ obj)
            return
        }
        this.startDrag(event,dragHandle)
    }
    startDrag(event: MouseEvent, dh: DragHandle ) {
        this.dragedDragHandle = dh;
        this.dragedDragHandle.startDrag(this.domXYToSvgXY(event));
        this.snapingView.appendChild(dh.getSnapSvg());
    }
    drag(event: MouseEvent) {
        this.dragedDragHandle?.draging(this.domXYToSvgXY(event));
    }
    stopDrag(event: MouseEvent) {
        if(this.dragedDragHandle != undefined){
            this.dragedDragHandle.stopDrag();
            this._onStopDrag(this.dragedDragHandle)
        }
        this.dragedDragHandle = undefined;
    }
    private domXYToSvgXY(event:MouseEvent){
        const pt = new DOMPoint(event.x,event.y);
        const matrix = this.svgWithViewport.getScreenCTM()!
        /*
        if(matrix.isIdentity){
            console.log("identity")
            return new Vector(pt.x,pt.y)
        }else{
            const tpt = pt.matrixTransform( matrix.inverse());
            return new Vector(tpt.x,tpt.y)
        }
        */
        const tpt = pt.matrixTransform( matrix.inverse());
        return new Vector(tpt.x,tpt.y)
        
    }
}
