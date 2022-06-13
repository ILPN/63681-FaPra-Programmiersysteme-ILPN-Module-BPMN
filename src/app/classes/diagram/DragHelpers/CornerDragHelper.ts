import { DragHelper } from "./DragHelper";
import { Arrow } from "../elements/arrow/Arrow";
import { Vector } from "../elements/arrow/Vector";
import { ArrowCorner } from "../elements/arrow/ArrowCorner";

export class CornerDragHelper extends DragHelper<ArrowCorner>{
    override startDrag(event: MouseEvent): void {
        super.startDrag(event)

    }
    override stopDrag(): void {
        super.stopDrag()
    }
    onDrag(ax: number, ay: number, delta:Vector): void {
        const el = this.dragedElement
        if(el == undefined) return
        el.x =ax;
        el.y =ay;
        el.updateSvg()
        el.arrow.updateSvg()
    }
}