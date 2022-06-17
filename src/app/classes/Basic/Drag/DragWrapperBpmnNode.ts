import { Vector } from "../../Utils/Vector";
import { BpmnNode } from "../Bpmn/BpmnNode";
import { Dragable } from "./Dragable";
import { DragWrapperGraph } from "./DragWrapperGraph";


export class DragWrapperBpmnNode<N extends BpmnNode> implements Dragable{
    private _draggableGraph: DragWrapperGraph;
    public get draggableGraph(): DragWrapperGraph {
        return this._draggableGraph;
    }

    private node:N
    constructor(node:N,dragableWrapperGraph:DragWrapperGraph){
        this._draggableGraph = dragableWrapperGraph
        this.node = node
    }
    setPos(value: Vector): void {
        this.node.setPos(value)
    }
    getPos(): Vector {
        return this.node.getPos()
    }
    updateSvg() {
        const nodeSvg = this.node.updateSvg()
        this.addDragablenessToSvg(nodeSvg)
        return nodeSvg
    }    
   
    private _dragged: boolean = false
    public get dragged(): boolean {
        return this._dragged;
    }
    public set dragged(value: boolean) {
        this._dragged = value;
    }

    addDragablenessToSvg(svg: SVGElement): void {
        
        svg.onmousedown = (event) => {
            this.draggableGraph.startDragNode( event, this)
        };
        svg.onmouseup = (event) => {
            this.draggableGraph.stopDrag(event);
        };
        svg.onmousemove = (event) => {
            this.draggableGraph.drag(event);
        };

    } 
}