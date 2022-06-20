import { BpmnGraph } from '../Bpmn/BpmnGraph';
import { SvgInterface } from '../Interfaces/SvgInterface';
import { Svg } from '../Svg/Svg';
import { DraggableEdge } from './DraggableEdge';
import { DraggableNode } from './DraggableNode';
import { DragHandle } from './DragHandle';
import { SnapElement } from './SnapElements/SnapElement';

export class DraggableGraph implements SvgInterface {
    private bpmnGraph: BpmnGraph;
    constructor(bpmnGraph: BpmnGraph, snaps?:SnapElement[]) {
        this.bpmnGraph = bpmnGraph;

        this.dEdges = bpmnGraph.edges.map((e,i)=>{
            const dragableEdge = new DraggableEdge(e,this)
            return dragableEdge
        })
        this.dNodes = bpmnGraph.nodes.map((n,i)=>{
            const dragableNode = new DraggableNode(n,this)
            const outDEdges = this.dEdges.filter((dE)=> dE.edge.from == n)
            for (const dragableEdge of outDEdges) {
                dragableNode.dragHandle.addDraggedAlong(dragableEdge.getStartCornerDragHandle())
            }

            const inDEdges = this.dEdges.filter((dE)=> dE.edge.to == n)
            for (const dragableEdge of inDEdges) {
                dragableNode.dragHandle.addDraggedAlong(dragableEdge.getEndCornerDragHandle())
            }
            return dragableNode
        })
    }
    private dEdges: DraggableEdge[] = []
    private dNodes: DraggableNode[] = []
    private snapSvgs: SVGElement | undefined;
    updateSvg(): SVGElement {
        const c = Svg.container();
        const cNodes = Svg.container('nodes');
        const cEdges = Svg.container('edges');
        c.appendChild(Svg.background());

        c.onmouseup = (event) => {
            this.stopDrag(event);
        };
        c.onmousemove = (event) => {
            this.drag(event);
        };

        for (const n of this.dNodes) {
            cNodes.appendChild(n.updateSvg());
        }

        
        for (const e of this.dEdges) {
            cEdges.appendChild(e.updateSvg());
        }

        this.snapSvgs = Svg.container('snapSvgs');
        c.appendChild(cNodes);
        c.appendChild(this.snapSvgs);
        c.appendChild(cEdges);
        return c;
    }

    private dragHandle: DragHandle | undefined;

    startDrag(event: MouseEvent, dh: DragHandle) {
        this.dragHandle = dh;
        this.dragHandle.startDrag(event);
        this.snapSvgs?.appendChild(dh.getSnapSvg());
    }
    drag(event: MouseEvent) {
        this.dragHandle?.draging(event);
    }
    stopDrag(event: MouseEvent) {
        this.dragHandle?.stopDrag();
        this.dragHandle = undefined;
    }
}
