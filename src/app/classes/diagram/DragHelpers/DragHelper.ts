import { Vector } from "../elements/arrow/Vector"
import { Element } from "../element"
import { MainElement } from "../elements/MainElement"
import { ArrowCorner } from "../elements/arrow/ArrowCorner"
import { DragHelperInterface } from "./DragHelperInterface"
export abstract class DragHelper<T extends Element> implements DragHelperInterface<T>{

    dragElement(e: MouseEvent) {
        if(!this.dragging) return
        const currentMousePos = new Vector( e.clientX, e.clientY)
        const delta = currentMousePos.minus(this.mouseStartPos)
        const elemMoveToPos = this.elementStartPos.plus(delta)
        this.onDrag(elemMoveToPos.x,elemMoveToPos.y,delta)
    }

   abstract onDrag(ax: number, ay: number, delta:Vector):void  

    public dragedElement:T
    private dragging = false
    private elementStartPos:Vector
    private mouseStartPos:Vector
    constructor(element:T , startPos:Vector = new Vector(), mouseStartPos:Vector = new Vector){
        this.dragedElement = element
        this.elementStartPos = startPos
        this.mouseStartPos = mouseStartPos
    }

    startDrag(event:MouseEvent){
        this.dragging = true
        const element = this.dragedElement
        this.elementStartPos.x = element.x
        this.elementStartPos.y = element.y
        this.mouseStartPos.x = event.clientX
        this.mouseStartPos.y = event.clientY
        
        this.dragedElement.draged = true

    }

    stopDrag(){
        this.dragging = false
        this.dragedElement.draged = false
        this.dragedElement.updateSvg()
    }
}