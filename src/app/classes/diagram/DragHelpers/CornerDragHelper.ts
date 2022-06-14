import { DragHelper } from "./DragHelper";
import { Vector } from "../elements/arrow/Vector";
import { ArrowCorner } from "../elements/arrow/ArrowCorner";
import { Element } from "../element";

export class CornerDragHelper extends DragHelper<ArrowCorner>{
    override startDrag(event: MouseEvent): void {
        super.startDrag(event)

    }
    override stopDrag(): void {
        super.stopDrag()
    }
    private snapToNeighbours = false
    private snapToNeighbourThreshold = 10

    setSnapToNeighbour(snaping:boolean, threshold:number=10){
        this.snapToNeighbours = snaping
        this.snapToNeighbourThreshold = threshold
    }
    
    onDrag(ax: number, ay: number, delta:Vector): void {
        const el = this.dragedElement
        if(el == undefined) return
        el.x =ax;
        el.y =ay;
        if(this.snapToNeighbours){
            this.snapXOrY(el,el.cornerBefore, this.snapToNeighbourThreshold)
            this.snapXOrY(el,el.cornerAfter, this.snapToNeighbourThreshold)
        }
        el.updateSvg()
        el.arrow.updateSvg()
    }
}