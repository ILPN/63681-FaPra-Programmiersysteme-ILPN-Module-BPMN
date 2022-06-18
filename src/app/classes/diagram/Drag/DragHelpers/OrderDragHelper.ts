import { DragHelper } from "./DragHelper";
import { Element } from "../../element";
import { Vector } from "src/app/classes/Utils/Vector";
import { DragHelperInterface } from "./DragHelperInterface";

export class OrderDragHelper2 implements DragHelperInterface<Element>{
    private dHsOfAllElements:Map<Element,DragHelper<Element>> = new Map()
    private elements:Element[] =[]
    private originalYCoordinates:number[] =[]

    private dragedElementDH:DragHelper<Element>
    constructor(dragedElementDH: DragHelper<Element>){
        this.dragedElementDH = dragedElementDH
    }

    addDragHelper(dh:DragHelper<Element>){
        //no duplicates
        if(this.elements.findIndex(e => e == dh.dragedElement) == -1){
            this.dHsOfAllElements.set(dh.dragedElement,dh)
            this.elements.push(dh.dragedElement)
        }
    }

    dragElement(e: MouseEvent): void {
        this.dragedElementDH.dragElement(e)
        this.elements.sort((a,b)=> a.y - b.y)
        for (let i = 0; i < this.elements.length; i++) {
            const el = this.elements[i];
            if(el != this.dragedElementDH.dragedElement){
                const newY = this.originalYCoordinates[i]
                this.dHsOfAllElements.get(el)?.onDrag(new Vector(el.x, newY),Vector.zero())
            }
        }
    }
    startDrag(event: MouseEvent): void {
        
        this.dHsOfAllElements.delete(this.dragedElementDH.dragedElement)
        if(this.elements.findIndex(e => e == this.dragedElementDH.dragedElement ) == -1){
            this.elements.push(this.dragedElementDH.dragedElement)
        }
        this.elements.sort((a,b)=> a.y - b.y)
        this.originalYCoordinates = this.elements.map(e => e.y)

        this.dragedElementDH.startDrag(event)
        for (const el of this.elements) {
            this.dHsOfAllElements.get(el)?.startDrag(event)
        }
        
    }
    stopDrag(): void {
        for (const el of this.elements) {
            this.dHsOfAllElements.get(el)?.stopDrag()
        }

        this.elements.sort((a,b)=> a.y - b.y)
        const index = this.elements.findIndex(e => e == this.dragedElementDH.dragedElement)
        this.dragedElementDH.onDrag(new Vector(this.dragedElementDH.elementStartPos.x, this.originalYCoordinates[index]), Vector.zero())
        this.dragedElementDH.stopDrag()
    }
    
    
  
}