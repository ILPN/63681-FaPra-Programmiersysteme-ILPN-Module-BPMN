import { from } from "rxjs";
import { SnapX } from "../../diagram/Drag/SnapElements/SnapX";
import { SnapY } from "../../diagram/Drag/SnapElements/SnapY";
import { Utility } from "../../Utils/Utility";
import { BpmnEdge, BpmnEdgeCorner } from "../Bpmn/BpmnEdge";
import { BpmnNode } from "../Bpmn/BpmnNode";
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

    private dwg:DragWrapperGraph
    private dragHandles:Map<BpmnEdgeCorner,DragHandle> = new Map()
    constructor(edge:BpmnEdge, dwg:DragWrapperGraph){
        this._edge = edge
        this.dwg = dwg


        for (const [i,corner] of this.edge.corners.entries()) {
            const dragHandle = new DragHandle(corner)
            dragHandle.addCallbackAfterDrag(() => this.updateSvg())
            dragHandle.addCallbackbeforeStartDrag((dE,dH) => this.assignSnaps(dE,dH))
            this.dragHandles.set(corner,dragHandle)
        }        
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

        const lastIndex = this.edge.corners.length-1
        for (const [i,corner] of this.edge.corners.entries()) {
            if(i==0 || i == lastIndex){
                const intersection = i==0? this.edge.nodeIntersection1: this.edge.nodeIntersection2
                const dragStartCir = Svg.circleNoStyle(intersection,"dragHandleInnerCorner")
                dragStartCir.onmousedown = (e) => this.dwg.startDrag(e,this.dragHandles.get(corner)!)
                const line = Svg.pathNoStyle([intersection, corner.getPos()],"edgeLineInNode")
                c.appendChild(line)
                c.appendChild(Svg.circleNoStyle(corner.getPos(),"endCircle"))
                c.appendChild(dragStartCir)


            }else{
                const dragCir = Svg.circleNoStyle(corner.getPos(),"dragHandleInnerCorner")
                dragCir.onmousedown = (e) => this.dwg.startDrag(e,this.dragHandles.get(corner)!)
                c.appendChild(dragCir)
            }
        }
        return c
    }
}