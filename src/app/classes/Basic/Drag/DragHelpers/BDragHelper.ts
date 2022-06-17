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

    private _actualPos = new Vector();
    public get actualPos() {
        return this._actualPos;
    }
    public set actualPos(value) {
        this._actualPos = value;
    }
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
    this.dragedElement.updateSvg()
   }

    public dragedElement:Dragable

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


    startDrag(event:MouseEvent){
        this._elementStartPos = this.dragedElement.getPos()
        this.mouseStartPos.x = event.clientX
        this.mouseStartPos.y = event.clientY
        this.dragedElement.dragged = true
    }
    stopDrag(){
        this.dragedElement.dragged = false
        this.snapSvg?.remove()
        this.dragedElement.updateSvg()
    }
}