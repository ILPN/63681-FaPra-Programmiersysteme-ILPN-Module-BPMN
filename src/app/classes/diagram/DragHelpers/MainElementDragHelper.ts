import { DragHelper } from "./DragHelper";
import { Arrow } from "../elements/arrow/Arrow";
import { Vector } from "../elements/arrow/Vector";
import { MainElement } from "../elements/MainElement";

export class MainElementDragHelper extends DragHelper<MainElement>{
    private arrowStartDeltas: Map<Arrow,Vector> = new Map()
    override startDrag( event: MouseEvent): void {
        super.startDrag(event)
        this.arrowStartDeltas = new Map()
        for (const arrow of this.dragedElement.in_arrows) {
            const startPos = arrow.getArrowTarget().getPos()
            this.arrowStartDeltas.set(arrow, startPos.minus(this.elementStartPos) )
        }
        for (const arrow of this.dragedElement.out_arrows) {
            const startPos =arrow.getArrowStart().getPos()
            this.arrowStartDeltas.set(arrow, startPos.minus(this.elementStartPos) )
        }
    }
    override stopDrag(): void {
        super.stopDrag()
        this.arrowStartDeltas = new Map()
    }
    onDrag(absolute:Vector, delta:Vector): void {
        const el = this.dragedElement
        if(el == undefined) return
        el.setPos(absolute)  
        el.updateSvg();

        //drag incoming arrows
        for (const arrow of el.in_arrows) {
            const startDelta =this.arrowStartDeltas.get(arrow)
            if( startDelta != undefined){
                const aPos = absolute.plus(startDelta)
                arrow.setArrowTarget(aPos.x, aPos.y);
                arrow.updateSvg();
            }
            
        }
        //drag outgoing arrows
        for (const arrow of el.out_arrows) {
            const startDelta =this.arrowStartDeltas.get(arrow)
            if( startDelta != undefined){
                const aPos = absolute.plus(startDelta)
                arrow.setArrowStart(aPos.x, aPos.y);
                arrow.updateSvg();
            }
            
        }
    }
}