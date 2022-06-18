import { SnapX } from "./SnapElements/SnapX";
import { SnapY } from "./SnapElements/SnapY";
import { Utility } from "../../Utils/Utility";
import { Vector } from "../../Utils/Vector";
import { BpmnEdge, BpmnEdgeCorner } from "../Bpmn/BpmnEdge";
import { Position } from "../Interfaces/Position";
import { SvgInterface } from "../Interfaces/SvgInterface";
import { Svg } from "../Svg/Svg";
import { DragHandle } from "./DragHandle";
import { DragWrapperGraph } from "./DragWrapperGraph";

export class DragableEdge implements SvgInterface{
    private _edge: BpmnEdge;
    public get edge(): BpmnEdge {
        return this._edge;
    }
    private dragged = false

    private dwg:DragWrapperGraph
    private dragHandles:Map<BpmnEdgeCorner,DragHandle> = new Map()
    constructor(edge:BpmnEdge, dwg:DragWrapperGraph){
        this._edge = edge
        this.dwg = dwg


        for (const corner of this.edge.corners) {
            this.newDragHandle(corner)
    }
}
    private newDragHandle(corner:BpmnEdgeCorner){
        const dragHandle = new DragHandle(corner)
        dragHandle.addCallbackAfterDrag(() => this.updateSvg())
        dragHandle.addCallbackbeforeStartDrag((dE,dH) =>{
            this.assignSnaps(dE,dH)
            this.dragged = true
            this.updateSvg()
        } )
        dragHandle.addCallbackAfterStopDrag((dE,dH) =>{
            this.dragged = false
            this.updateSvg()
        } )
        this.dragHandles.set(corner,dragHandle)
        return dragHandle
    }

    private assignSnaps(dragedElement:Position,dragHandle:DragHandle){
        if (! (dragedElement instanceof BpmnEdgeCorner)) return
        const cornerIndex = this._edge.corners.findIndex(c => c == dragedElement)
        if(cornerIndex == -1) return
        const lastIndex = this.edge.corners.length-1
        if(0<cornerIndex && cornerIndex<lastIndex){
            const cornerBefore = this.edge.corners[cornerIndex-1];
            const cornerAfter = this.edge.corners[cornerIndex+1];

            dragHandle.addSnapElement(new SnapX(cornerBefore.x))
            dragHandle.addSnapElement(new SnapY(cornerBefore.y))

            dragHandle.addSnapElement(new SnapX(cornerAfter.x))
            dragHandle.addSnapElement(new SnapY(cornerAfter.y))
        }
        if(cornerIndex ==0){
            dragHandle.addSnapElement(new SnapX(this.edge.from.x))
            dragHandle.addSnapElement(new SnapY(this._edge.from.y))
        }
        if(cornerIndex ==lastIndex){
            dragHandle.addSnapElement(new SnapX(this.edge.to.x))
            dragHandle.addSnapElement(new SnapY(this._edge.to.y))
        }
    }

    getEndCornerDragHandle(){
        return this.dragHandles.get(this._edge.corners[this.edge.corners.length-1])!
    }
    getStartCornerDragHandle(){
        return this.dragHandles.get(this._edge.corners[0])!
    }
    private _svg: SVGElement | undefined;
    updateSvg(): SVGElement {
        const newSvg = this.createSvg();
        
        if(this._svg != undefined &&this._svg.isConnected){
            this._svg.replaceWith(newSvg);
        }
        this._svg = newSvg;
        return newSvg;
    }
    createSvg():SVGElement{
        const c = Svg.container()
        c.appendChild(this.edge.createSvg())
        c.appendChild(this.dragCircles())
        c.appendChild(this.addCircles())
        return c
    }
    addCircles(): SVGElement {
        const c = Svg.container()
        for (let i = 1; i < this.edge.corners.length; i++) {
            let cornerBeforePos = this.edge.corners[i-1].getPos();
            if(i-1==0) cornerBeforePos = this.edge.nodeIntersection1
            let cornerPos = this.edge.corners[i].getPos();
            if(i== this.edge.corners.length-1) cornerPos = this.edge.nodeIntersection2


            const pos = Vector.center(cornerBeforePos,cornerPos)
            const plusCircle = Svg.circleNoStyle(pos,"plusCircle")
            Utility.addSimulatedClickListener(plusCircle,() =>{
                this.addCorner(i,pos)
            })
            c.appendChild(plusCircle)
        }    
        return c    
    }
    addCorner(at: number, pos:Vector) {
        const newCorner = this._edge.addCorner(pos,at)
        this.newDragHandle(newCorner)     
        this.updateSvg()
    }
    dragCircles(): SVGElement {
        const c = Svg.container()
        const lastIndex = this.edge.corners.length-1
        for (const [i,corner] of this.edge.corners.entries()) {
            if(i==0 || i == lastIndex){
                const intersection = i==0? this.edge.nodeIntersection1: this.edge.nodeIntersection2
                const dragStartCir = Svg.circleNoStyle(intersection,"dragHandleInnerCorner")
                dragStartCir.onmousedown = (e) => this.dwg.startDrag(e,this.dragHandles.get(corner)!)
                const line = Svg.pathNoStyle([intersection, corner.getPos()],"edgeLineInNode")
                if(this.dragged){
                    c.appendChild(line)
                    c.appendChild(Svg.circleNoStyle(corner.getPos(),"endCircle"))
                }
                c.appendChild(dragStartCir)


            }else{
                const dragCir = Svg.circleNoStyle(corner.getPos(),"dragHandleInnerCorner")
                dragCir.onmousedown = (e) => this.dwg.startDrag(e,this.dragHandles.get(corner)!)
                c.appendChild(dragCir)
                c.appendChild(this.deleteCircle(i,corner))
            }
        }
        return c
    }
    deleteCircle(i:number, corner:BpmnEdgeCorner): SVGElement {
        const distance = 10
        const dir1 = this.edge.corners[i+1]
            .getPos()
            .minus(corner.getPos())
            .toUnitVector();
        const dir2 = this.edge.corners[i-1]
            .getPos()
            .minus(corner.getPos())
            .toUnitVector();
        let dir = dir1.plus(dir2).muliplied(-1);
        if (dir.isAlmostZero()) {
            const nDir1 = dir1.rotate(Math.PI / 2);
            const nDir2 = dir2.rotate(Math.PI / 2);
            dir = nDir1.y< nDir2.y? nDir1:nDir2 //to avoid delete Circle beeing hidden behind mouse pointer
        } else {
            dir = dir.toUnitVector();
        }
        const pos = corner.getPos().plus(dir.muliplied(distance));


        const deleteCircle = Svg.circleNoStyle(pos,"deleteCircle")


        //somehow onclick doesnt work after having draged the corner
        //this.svgDelete.onclick = e => this.arrow.removeCorner(this)
        //this.svgDelete.addEventListener("click", () => this.arrow.removeCorner(this));
        Utility.addSimulatedClickListener(deleteCircle, (e) =>{
            this.edge.removeCorner(i)
            this.dragHandles.delete(corner)
            this.updateSvg()
        }            
        );

        return deleteCircle
    }
}