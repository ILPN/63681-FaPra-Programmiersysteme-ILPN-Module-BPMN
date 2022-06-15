import { Vector } from "../elements/arrow/Vector"
import { Element } from "../element"
import { DragHelperInterface } from "./DragHelperInterface"
import { SnapElement } from "./SnapElement"
import { Utility } from "../../Utility"
export abstract class DragHelper<T extends Element> implements DragHelperInterface<T>{

    private snapElements: SnapElement[] = []
    public addSnapElement(snapElement: SnapElement){
        this.snapElements.push(snapElement)
    }
    private snapSvg:SVGElement | undefined
    getSnapSvg(){
       const svg = Utility.createSvgElement("svg")
       svg.id = "snapSvgs"
       for (const snapEl of this.snapElements) {
        svg.appendChild(snapEl.createSVG())
       }
       this.snapSvg = svg
       return svg
    }

    private actualPos = new Vector()
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

   abstract onDrag(absolute:Vector, delta:Vector):void  

    public dragedElement:T
    private dragging = false
    protected elementStartPos:Vector
    private mouseStartPos:Vector
    constructor(element:T , startPos:Vector = new Vector(), mouseStartPos:Vector = new Vector){
        this.dragedElement = element
        this.elementStartPos = startPos
        this.mouseStartPos = mouseStartPos
    }

    startDrag(event:MouseEvent){
        this.dragging = true
        const element = this.dragedElement
        this.elementStartPos = element.getPos()
        this.mouseStartPos.x = event.clientX
        this.mouseStartPos.y = event.clientY
        this.dragedElement.draged = true

    }

    stopDrag(){
        this.dragging = false
        this.dragedElement.draged = false
        this.snapSvg?.remove()
        this.dragedElement.updateSvg()
    }
}