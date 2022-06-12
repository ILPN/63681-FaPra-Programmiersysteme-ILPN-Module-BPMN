import { DragHelper } from "./DragHelper";
import { Arrow } from "../elements/arrow/Arrow";
import { Vector } from "../elements/arrow/Vector";
import { MainElement } from "../elements/MainElement";

export class MainElementDragHelper extends DragHelper<MainElement>{
    private arrowStartPositions: Map<Arrow,Vector> = new Map()
    override startDrag(element: MainElement, event: MouseEvent): void {
        super.startDrag(element, event)
        this.arrowStartPositions = new Map()
        for (const arrow of element.in_arrows) {
            const startPos = new Vector(arrow.getArrowTarget().x, arrow.getArrowTarget().y )
            this.arrowStartPositions.set(arrow, startPos )
        }
        for (const arrow of element.out_arrows) {
            const startPos = new Vector(arrow.getArrowStart().x, arrow.getArrowStart().y )
            this.arrowStartPositions.set(arrow, startPos )
        }
    }
    override stopDrag(): void {
        super.stopDrag()
        this.arrowStartPositions = new Map()
    }
    onDrag(ax: number, ay: number, delta:Vector): void {
        const el = this.dragedElement
        if(el == undefined) return
        el.x =ax;
        el.y =ay;     
        el.updateSvg();

        //drag incoming arrows
        for (const arrow of el.in_arrows) {
            const startPos =this.arrowStartPositions.get(arrow)
            if( startPos != undefined){
                const aPos = startPos.plus(delta)
                arrow.setArrowTarget(aPos.x, aPos.y);
                arrow.updateSvg();
            }
            
        }
        //drag outgoing arrows
        for (const arrow of el.out_arrows) {
            const startPos =this.arrowStartPositions.get(arrow)
            if( startPos != undefined){
                const aPos = startPos.plus(delta)
                arrow.setArrowStart(aPos.x, aPos.y);
                arrow.updateSvg();
            }
            
        }
    }
}