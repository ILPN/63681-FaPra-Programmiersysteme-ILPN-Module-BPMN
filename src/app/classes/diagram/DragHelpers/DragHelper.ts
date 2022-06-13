import { Vector } from "../elements/arrow/Vector"
import { Element } from "../element"
import { MainElement } from "../elements/MainElement"
import { ArrowCorner } from "../elements/arrow/ArrowCorner"
export abstract class DragHelper<T extends Element>{

    dragElement(e: MouseEvent) {
        if(!this.draging()) return
        const currentMousePos = new Vector( e.clientX, e.clientY)
        const delta = currentMousePos.minus(this.mouseStartPos)
        const elemMoveToPos = this.elementStartPos.plus(delta)
        this.onDrag(elemMoveToPos.x,elemMoveToPos.y,delta)
    }

   abstract onDrag(ax: number, ay: number, delta:Vector):void  

    public dragedElement:T | undefined
    private elementStartPos:Vector
    private mouseStartPos:Vector
    constructor(element:T | undefined= undefined, startPos:Vector = new Vector(), mouseStartPos:Vector = new Vector){
        this.dragedElement = element
        this.elementStartPos = startPos
        this.mouseStartPos = mouseStartPos
    }

    draging (){
        if (this.dragedElement == undefined) return false
        return true
    }
    startDrag(element:T, event:MouseEvent){
        this.dragedElement = element
        this.elementStartPos.x = element.x
        this.elementStartPos.y = element.y
        this.mouseStartPos.x = event.clientX
        this.mouseStartPos.y = event.clientY
        
        this.dragedElement.draged = true

    }

    stopDrag(){
        if(this.dragedElement == undefined) return 
        this.dragedElement.draged = false
        this.dragedElement.updateSvg()
        this.dragedElement = undefined
    }
}