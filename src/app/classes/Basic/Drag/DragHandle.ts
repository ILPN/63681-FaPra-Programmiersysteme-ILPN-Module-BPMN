import { SnapElement } from "../../diagram/Drag/SnapElements/SnapElement";
import { Utility } from "../../Utils/Utility";
import { Vector } from "../../Utils/Vector";
import { Position } from "../Interfaces/Position";
import { SvgInterface } from "../Interfaces/SvgInterface";
import { Svg } from "../Svg/Svg";
import { DragWrapperGraph } from "./DragWrapperGraph";

export class DragHandle implements SvgInterface{
    private dragedElement:Position
    private draged = false
    private dg:DragWrapperGraph
    constructor(dragedElement:Position, dg:DragWrapperGraph){
        this.dragedElement = dragedElement
        this.dg = dg
    }

    addDraggedAlong(dragedAlong:DragHandle){
        if(dragedAlong.dragedElement == this.dragedElement) return
        Utility.pushIfNotInArray<DragHandle>(dragedAlong, this.dragedAlong)
    }
    
    private _svg: SVGElement | undefined;
    updateSvg(): SVGElement {
        const newSvg = this.createSvg();
        
        if(this._svg != undefined &&this._svg.isConnected){
            this._svg.replaceWith(newSvg);
        }
        this._svg = newSvg;
        return newSvg;
    }

    private createSvg() {
        const svg =Svg.circle(this.dragedElement.getPos(), 10)
        svg.onmousedown = (event) => {
            this.dg.startDrag(event, this);
        };
        return svg
    }







    
    private snapElements: SnapElement[] = []
    public addSnapElement(snapElement: SnapElement){
        this.snapElements.push(snapElement)
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

    dragElement(e: MouseEvent) {
        const currentMousePos = new Vector( e.clientX, e.clientY)
        const delta = currentMousePos.minus(this.mouseStartPos)
        
        let newPos = this.startPos.plus(delta)

        for (const snapElement of this.snapElements) {
            newPos = snapElement.snap(newPos)
        }

        //only call onDrag and dragalong if position is changing
        if (!newPos.equals(this.dragedElement.getPos())){
            this.onDrag(newPos,delta)
            for (const dragHandle of this.dragedAlong) {
                dragHandle.dragElement(e)
            }
        }
    }


   protected onDrag(absolute:Vector, delta:Vector):void{
    this.dragedElement.setPos(absolute)
    this.updateAffectedSvgs()

    
   }

    private dragedAlong:DragHandle[] =[]

    protected startPos: Vector = new Vector();

    private mouseStartPos:Vector = new Vector()

    startDrag(event:MouseEvent){
        this.startPos = this.dragedElement.getPos()
        this.mouseStartPos.x = event.clientX
        this.mouseStartPos.y = event.clientY
        this.draged = true

        for (const dragHandle of this.dragedAlong) {
            dragHandle.startDrag(event)
        }
    }
    stopDrag(){
        this.updateAffectedSvgs()
        this.draged = false        
        this.snapSvg?.remove()
        for (const dragHandle of this.dragedAlong) {
            dragHandle.stopDrag()
        }
    }

    
    updateAffectedSvgs() {
        this.updateSvg()
        for (const dh of this.dragedAlong) {
            dh.updateAffectedSvgs()
        }
    }
}