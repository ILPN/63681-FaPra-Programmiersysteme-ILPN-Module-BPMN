import { BpmnEdge, BpmnEdgeCorner } from "../Bpmn/BpmnEdge";
import { BpmnNode } from "../Bpmn/BpmnNode";
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
    private dragHandles:DragHandle<BpmnEdgeCorner>[] = []
    constructor(edge:BpmnEdge, dwg:DragWrapperGraph){
        this._edge = edge
        this.dwg = dwg

        this.dragHandles = edge.corners.map((c,i) =>{
            const dragHandle = new DragHandle(c)
            dragHandle.addCallback(() => this.updateSvg())
            return dragHandle
        })
    }
    getEndCornerDragHandle(){
        return this.dragHandles[this.dragHandles.length-1]
    }
    getStartCornerDragHandle(){
        return this.dragHandles[0]
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
                dragStartCir.onmousedown = (e) => this.dwg.startDrag(e,this.dragHandles[i])
                const line = Svg.pathNoStyle([intersection, corner.getPos()],"edgeLineInNode")
                c.appendChild(line)
                c.appendChild(Svg.circleNoStyle(corner.getPos(),"endCircle"))
                c.appendChild(dragStartCir)


            }else{
                const dragCir = Svg.circleNoStyle(corner.getPos(),"dragHandleInnerCorner")
                dragCir.onmousedown = (e) => this.dwg.startDrag(e,this.dragHandles[i])
                c.appendChild(dragCir)
            }
        }
        return c
    }
}