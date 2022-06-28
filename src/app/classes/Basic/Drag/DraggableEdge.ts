import { SnapX } from "./SnapElements/SnapX";
import { SnapY } from "./SnapElements/SnapY";
import { Utility } from "../../Utils/Utility";
import { Vector } from "../../Utils/Vector";
import { BpmnEdge } from "../Bpmn/BpmnEdge/BpmnEdge";
import { Svg } from "../Svg/Svg";
import { DragHandle } from "./DragHandle";
import { DraggableGraph } from "./DraggableGraph";
import { BpmnEdgeCorner } from "../Bpmn/BpmnEdge/BpmnEdgeCorner";
import { BpmnDummyEdgeCorner } from "../Bpmn/BpmnEdge/BpmnDummyEdgeCorner";
import { GetSvgManager } from "../Interfaces/GetSvgManager";
import { SvgManager } from "../Svg/SvgManager/SvgManager";
import { DragManager } from "./DragManager/DragManager";

export class DraggableEdge implements GetSvgManager{
    private _svgManager: SvgManager | undefined;
    public get svgManager(): SvgManager {
        if(this._svgManager == undefined){
            this._svgManager = new SvgManager("DraggableGraph",() => this.svgCreation())
        }
        return this._svgManager;
    }
    
    
    
    
    private _edge: BpmnEdge;
    public get edge(): BpmnEdge {
        return this._edge;
    }
    private dragged = false

    private dwg:DragManager
    constructor(edge:BpmnEdge, dwg:DragManager){
        this._edge = edge
        this.dwg = dwg
}
    private newDragHandle(corner:BpmnEdgeCorner){
        const dragHandle = new DragHandle(corner)
        this.addCallbacksToDragHandle(dragHandle)
        return dragHandle
    }
    private addCallbacksToDragHandle(dragHandle:DragHandle){
        dragHandle.addCallbackAfterDragTo(() => this.svgManager.redraw())
        dragHandle.addCallbackBeforeStartDrag((dE,dH) =>{
            this.dragged = true
            this.svgManager.redraw()
        } )
        dragHandle.addCallbackAfterStopDrag((dE,dH) =>{
            this.dragged = false
            this.svgManager.redraw()
        } )
    }

    getEndCornerDragHandle(){
        const dH = this.newDragHandle(this._edge.corners[this.edge.corners.length-1])
        this.addSnapsToDragHandle(dH)
        return dH
    }
    getStartCornerDragHandle(){
        const dH = this.newDragHandle(this._edge.corners[0])
        this.addSnapsToDragHandle(dH)
        return dH
    }

    private svgCreation():SVGElement{
        const c = Svg.container()
        c.appendChild(this.edge.svgManager.getNewSvg())
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


            if(cornerBeforePos.distanceTo(cornerPos)> 20 ){
                const pos = Vector.center(cornerBeforePos,cornerPos)
            const plusCircle = Svg.circleNoStyleNoRadius(pos,"plusCircle")
            Utility.addSimulatedClickListener(plusCircle,() =>{
                this.addCorner(i,pos)
            })
            c.appendChild(plusCircle)
            }
            
        }    
        return c    
    }
    addCorner(at: number, pos:Vector) {
        this._edge.addCorner(pos,at)
        this.svgManager.redraw()
    }
    dragCircles(): SVGElement {
        const c = Svg.container()
        const lastIndex = this.edge.corners.length-1
        for (const [i,corner] of this.edge.corners.entries()) {
            if(i==0 || i == lastIndex){
                const intersection = i==0? this.edge.nodeIntersection1: this.edge.nodeIntersection2
                const dragStartCir = Svg.circleNoStyleNoRadius(intersection,"dragHandleInnerCorner")
                dragStartCir.onmousedown = (e) => this.dwg.startDrag(e,i==0? this.getStartCornerDragHandle(): this.getEndCornerDragHandle())
                const line = Svg.pathNoStyle([intersection, corner.getPos()],"edgeLineInNode")
                if(this.dragged){
                    c.appendChild(line)
                    c.appendChild(Svg.circleNoStyleNoRadius(corner.getPos(),"endCircle"))
                }
                c.appendChild(dragStartCir)


            }else{
                
                if(corner instanceof BpmnDummyEdgeCorner){
                    const dragCir = Svg.circleNoStyleNoRadius(corner.getPos(),"dragHandleDummyCorner")
                    dragCir.onmousedown = (e) => {
                        this.dwg.startDragWithObj(e,corner)
                    }
                    c.appendChild(dragCir)
                }else{
                    const dragCir = Svg.circleNoStyleNoRadius(corner.getPos(),"dragHandleInnerCorner")
                    dragCir.onmousedown = (e) => {
                        const dragHandle = this.newDragHandle(corner)
                        this.addSnapsToDragHandle(dragHandle)
                        this.dwg.startDrag(e,dragHandle)
                    }
                    c.appendChild(dragCir)
                    c.appendChild(this.deleteCircle(i,corner))  
                }
                
            }
        }
        return c
    }
    addSnapsToDragHandle(dragHandle: DragHandle) {
        const index = this.edge.corners.findIndex(c => c == dragHandle.dragedElement)
        if(index == -1) return
        if(index ==0){
            dragHandle.addSnapElement(new SnapX(this.edge.from.x))
            dragHandle.addSnapElement(new SnapY(this.edge.from.y))
        }else if(index == this._edge.corners.length-1){
            dragHandle.addSnapElement(new SnapX(this.edge.to.x))
            dragHandle.addSnapElement(new SnapY(this.edge.to.y))
        }else{
            const cornerBeforePos = this.edge.corners[index-1].getPos()
            const cornerAfterPos = this.edge.corners[index+1].getPos()
            dragHandle.addSnapElement(new SnapX(cornerBeforePos.x))
            dragHandle.addSnapElement(new SnapY(cornerBeforePos.y))
            dragHandle.addSnapElement(new SnapX(cornerAfterPos.x))
            dragHandle.addSnapElement(new SnapY(cornerAfterPos.y))

        }
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


        const deleteCircle = Svg.circleNoStyleNoRadius(pos,"deleteCircle")


        //somehow onclick doesnt work after having draged the corner
        //this.svgDelete.onclick = e => this.arrow.removeCorner(this)
        //this.svgDelete.addEventListener("click", () => this.arrow.removeCorner(this));
        Utility.addSimulatedClickListener(deleteCircle, (e) =>{
            this.edge.removeCorner(i)
            this.svgManager.redraw()
        }            
        );

        return deleteCircle
    }
}