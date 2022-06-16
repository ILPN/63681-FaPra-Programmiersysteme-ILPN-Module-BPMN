import { DragHelper } from "./DragHelper";
import { ArrowCorner } from "../../elements/arrow/ArrowCorner";
import { Vector } from "src/app/classes/Utils/Vector";

export class CornerDragHelper extends DragHelper<ArrowCorner>{
    override startDrag(event: MouseEvent): void {
        super.startDrag(event)

    }
    override stopDrag(): void {
        super.stopDrag()
    }
    
    onDrag(absolute:Vector, delta:Vector): void {
        const el = this.dragedElement
        if(el == undefined) return
        el.setPos(absolute)
        el.updateSvg()
        el.arrow.updateSvg()
    }
}