import { Vector } from "../elements/arrow/Vector"
import { Element } from "../element"
import { DragHelperInterface } from "./DragHelperInterface"
export abstract class DragHelper<T extends Element> implements DragHelperInterface<T>{

    protected snapXOrY(e:Element, to:Element|undefined, th:number){
        if(e == undefined || to == undefined) return
        if(Math.abs(to.x - e.x)<= th) e.x = to.x
        if(Math.abs(to.y - e.y)<= th) e.y = to.y
    }
    private elemMoveToPosJustBefore = new Vector()
    dragElement(e: MouseEvent) {
        if(!this.dragging) return
        const currentMousePos = new Vector( e.clientX, e.clientY)
        const delta = currentMousePos.minus(this.mouseStartPos)
        const elemMoveToPos = this.elementStartPos.plus(delta)

        console.log("called here"+ this._grid)

        if (this._grid != -1){
            console.log("called it")
            elemMoveToPos.x = Math.round(elemMoveToPos.x/this._grid)* this._grid
            elemMoveToPos.y = Math.round(elemMoveToPos.y/this._grid)* this._grid

        }

        if (!elemMoveToPos.equals(this.elemMoveToPosJustBefore)){
            this.onDrag(elemMoveToPos.x,elemMoveToPos.y,delta)
        }
        this.elemMoveToPosJustBefore = elemMoveToPos
    }

   abstract onDrag(ax: number, ay: number, delta:Vector):void  

    public dragedElement:T
    private dragging = false
    private elementStartPos:Vector
    private mouseStartPos:Vector
    private _grid = -1
    setGrid(grid:number){
        this._grid = grid
        console.log("setgrid to"+ this._grid)
    }
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