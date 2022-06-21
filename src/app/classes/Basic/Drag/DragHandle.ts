import { SnapElement } from "./SnapElements/SnapElement";
import { Utility } from "../../Utils/Utility";
import { Vector } from "../../Utils/Vector";
import { Position } from "../Interfaces/Position";
import { Svg } from "../Svg/Svg";

export class DragHandle{
    private afterDragTo: ()=>void = ()=>{}
    addCallbackAfterDragTo(afterDrag: () => void) {
       this.afterDragTo = afterDrag;
    }
    private beforeStartDrag: ((dragedElement: Position, dragHandle: DragHandle) => void) | undefined 
    addCallbackBeforeStartDrag(beforeStartDrag: (dragedElement:Position, dragHandle:DragHandle) => void) {
       this.beforeStartDrag = beforeStartDrag;
    }

    private afterStopDrag: ((dragedElement: Position, dragHandle: DragHandle) => void) | undefined 
    addCallbackAfterStopDrag(afterStopDrag: (dragedElement:Position, dragHandle:DragHandle) => void) {
       this.afterStopDrag = afterStopDrag;
    }
    
    private _dragedElement: Position;
    public get dragedElement(): Position {
        return this._dragedElement;
    }

    constructor(dragedElement:Position,){
        this._dragedElement = dragedElement
     }

    addDraggedAlong(dragedAlong:DragHandle){
        if(dragedAlong.dragedElement == this.dragedElement) return
        Utility.pushIfNotInArray<DragHandle>(dragedAlong, this.dragedAlong)
    }
    
    private snapElements: SnapElement[] = []
    public addSnapElement(snapElement: SnapElement){
        this.snapElements.push(snapElement)
    }
    public addSnapElements(snapElements: SnapElement[]){
        for (const snap of snapElements) {
            this.addSnapElement(snap)
        }
    }
    private snapSvg:SVGElement | undefined
    /**
     * 
     * @returns svg representing where drag will snap to
     */
    getSnapSvg(){
       const svg = Svg.container()
       svg.id = "snapSvgs"
       for (const snapEl of this.snapElements) {
        svg.appendChild(snapEl.createSVG())
       }
       this.snapSvg = svg
       return svg
    }

    draging(e: MouseEvent) {
        const currentMousePos = new Vector( e.clientX, e.clientY)
        const delta = currentMousePos.minus(this.mouseStartPos)
        
        let newPos = this.startPos.plus(delta)

        for (const snapElement of this.snapElements) {
            newPos = snapElement.snap(newPos)
        }
        const deltaEL = newPos.minus(this.startPos)
        //only call onDrag if position is changing
        if (!newPos.equals(this.dragedElement.getPos())){
            this.onDrag(deltaEL)
        }
    }


   protected onDrag(delta:Vector):void{
    const newPos = this.startPos.plus(delta)
    this.dragTo(newPos)
    
   }
   public dragTo(newPos:Vector){
    this.dragedElement.setPos(newPos)
    const delta = newPos.minus(this.startPos)
    for (const dh of this.dragedAlong) {
        dh.onDrag(delta)
    }
    this.afterDragTo()
   }

    private dragedAlong:DragHandle[] =[]

    protected startPos: Vector = new Vector();

    private mouseStartPos:Vector = new Vector()

    startDrag(event:MouseEvent){
        if(this.beforeStartDrag != undefined)
            this.beforeStartDrag(this.dragedElement,this)
        this.startPos = this.dragedElement.getPos()
        this.mouseStartPos.x = event.clientX
        this.mouseStartPos.y = event.clientY
        for (const dragHandle of this.dragedAlong) {
            dragHandle.startDrag(event)
        }
    }
    stopDrag(){
        this.snapSvg?.remove()
        for (const dragHandle of this.dragedAlong) {
            dragHandle.stopDrag()
        }

        if(this.afterStopDrag != undefined)
            this.afterStopDrag(this.dragedElement,this)
    }

}