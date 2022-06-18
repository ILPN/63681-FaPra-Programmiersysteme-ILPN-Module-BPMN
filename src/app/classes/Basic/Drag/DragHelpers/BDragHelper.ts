import { StyleUtils } from "@angular/flex-layout";
import { SnapElement } from "src/app/classes/diagram/Drag/SnapElements/SnapElement";
import { Utility } from "src/app/classes/Utils/Utility";
import { Vector } from "src/app/classes/Utils/Vector";
import { Dragable } from "../Dragable";
export class BDragHelper{

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
       const svg = Utility.createSvgElement("svg")
       svg.id = "snapSvgs"
       for (const snapEl of this.snapElements) {
        svg.appendChild(snapEl.createSVG())
       }
       this.snapSvg = svg
       return svg
    }

    private actualPos = new Vector();
    /**
     * gets called in mouseMove
     * @param e
     */
    dragElement(e: MouseEvent) {
        const currentMousePos = new Vector( e.clientX, e.clientY)
        const delta = currentMousePos.minus(this.mouseStartPos)
        let newPos = this.elementStartPos.plus(delta)

        for (const snapElement of this.snapElements) {
            newPos = snapElement.snap(newPos)
        }

        if (!newPos.equals(this.actualPos)){
            this.onDrag(newPos,delta)
        }
        this.actualPos = newPos
    }


   protected onDrag(absolute:Vector, delta:Vector):void{
    this.dragedElement.setPos(absolute)
    this.dragedElement.updateAffectedSvgs()


    for (const dragable of this.dragedAlong) {
        const startPos = this.startPositions.get(dragable)
        dragable.setPos(startPos!.plus(delta))
    }




   }

    private dragedElement:Dragable

    private dragedAlong:Dragable[] =[]
    private startPositions: Map<Dragable,Vector> = new Map()

    protected _elementStartPos: Vector;
     get elementStartPos(): Vector {
        return this._elementStartPos;
    }
    private mouseStartPos:Vector
    constructor(subject:Dragable){
        this.dragedElement = subject
        this._elementStartPos = subject.getPos()
        this.mouseStartPos = new Vector()
    }

    addDraggedAlong(dragedAlong:Dragable){
        if(dragedAlong == this.dragedElement) return
        Utility.pushIfNotInArray<Dragable>(dragedAlong, this.dragedAlong)
    }


    startDrag(event:MouseEvent){
        this._elementStartPos = this.dragedElement.getPos()
        this.mouseStartPos.x = event.clientX
        this.mouseStartPos.y = event.clientY
        this.dragedElement.dragged = true

        for (const dragable of this.dragedAlong) {
            this.startPositions.set(dragable, dragable.getPos())
            dragable.dragged = true
        }
    }
    stopDrag(){
        this.dragedElement.dragged = false
        this.dragedElement.updateAffectedSvgs()

        for (const dragable of this.dragedAlong) {
            this.startPositions.set(dragable, dragable.getPos())
            dragable.dragged = false
            dragable.updateAffectedSvgs()
        }
        this.snapSvg?.remove()
        this.startPositions.clear()
        this.dragedAlong = []
    }
}