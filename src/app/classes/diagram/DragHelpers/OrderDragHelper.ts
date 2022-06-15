import { DragHelperInterface } from "./DragHelperInterface";
import { Element } from "../element";
import { MainElementDragHelper } from "./MainElementDragHelper";
import { Vector } from "../elements/arrow/Vector";
import { skip } from "rxjs";
import { DragHelper } from "./DragHelper";

export class OrderDragHelper extends MainElementDragHelper{
    private dragHelpersOfAllElements:Map<Element,DragHelper<Element>> = new Map()
    private elements:Element[] =[]
    private originalYCoordinates:number[] =[]
    addDragHelper(dh:DragHelper<Element>){
        //no duplicates
        if(this.elements.findIndex(e => e == dh.dragedElement) == -1){
            this.dragHelpersOfAllElements.set(dh.dragedElement,dh)
            this.elements.push(dh.dragedElement)
        }
    }
    override startDrag(event: MouseEvent): void {
        super.startDrag(event)

        this.dragHelpersOfAllElements.delete(this.dragedElement)
        if(this.elements.findIndex(e => e == this.dragedElement ) == -1){
            this.elements.push(this.dragedElement)
        }

        for (const el of this.elements) {
            this.dragHelpersOfAllElements.get(el)?.startDrag(event)
        }

        this.elements.sort((a,b)=> a.y - b.y)
        this.originalYCoordinates = this.elements.map(e => e.y)
    }
    override onDrag(absolute: Vector, delta: Vector): void {
        super.onDrag(new Vector(this.elementStartPos.x,absolute.y),delta)
        this.elements.sort((a,b)=> a.y - b.y)
        for (let i = 0; i < this.elements.length; i++) {
            const el = this.elements[i];
            if(el != this.dragedElement){
                const newY = this.originalYCoordinates[i]
                this.dragHelpersOfAllElements.get(el)?.onDrag(new Vector(el.x, newY),Vector.zero())
            }
        }
    }
    override stopDrag(): void {
        for (const el of this.elements) {
            this.dragHelpersOfAllElements.get(el)?.stopDrag()
        }

        this.elements.sort((a,b)=> a.y - b.y)
        const index = this.elements.findIndex(e => e == this.dragedElement)
        super.onDrag(new Vector(this.elementStartPos.x, this.originalYCoordinates[index]), Vector.zero())
        super.stopDrag()

    }

    

}