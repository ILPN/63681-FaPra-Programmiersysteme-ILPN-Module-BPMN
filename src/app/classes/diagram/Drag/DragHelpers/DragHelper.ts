import { Utility } from "src/app/classes/Utils/Utility";
import { Vector } from "src/app/classes/Utils/Vector";
import { SnapElement } from "../SnapElements/SnapElement"
import { DragHelperInterface } from "./DragHelperInterface"
import { Element } from "../../element"
export abstract class DragHelper<T extends Element> implements DragHelperInterface<T>{

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
        if(!this.dragging) return
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

/**
 * should update position of draged Element
 * @param absolute absolute position where element should be draged to
 * @param delta 
 */
   abstract onDrag(absolute:Vector, delta:Vector):void  

    public dragedElement:T
    private dragging = false
    protected _elementStartPos: Vector;
     get elementStartPos(): Vector {
        return this._elementStartPos;
    }
    private mouseStartPos:Vector
    constructor(element:T , startPos:Vector = new Vector(), mouseStartPos:Vector = new Vector){
        this.dragedElement = element
        this._elementStartPos = startPos
        this.mouseStartPos = mouseStartPos
    }

    /**
     * called on mouseDown
     * @param event 
     */
    startDrag(event:MouseEvent){
        this.dragging = true
        const element = this.dragedElement
        this._elementStartPos = element.getPos()
        this.mouseStartPos.x = event.clientX
        this.mouseStartPos.y = event.clientY
        this.dragedElement.draged = true

    }

    /**
     * called on mouseUp
     */
    stopDrag(){
        this.dragging = false
        this.dragedElement.draged = false
        this.snapSvg?.remove()
        this.dragedElement.updateSvg()
    }
}