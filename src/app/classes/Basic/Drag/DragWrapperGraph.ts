import { SnapX } from '../../diagram/Drag/SnapElements/SnapX';
import { BpmnNode } from '../Bpmn/BpmnNode';
import { BpmnGraph } from '../BpmnGraph';
import { Position } from '../Interfaces/Position';
import { SvgInterface } from '../Interfaces/SvgInterface';
import { Svg } from '../Svg/Svg';
import { DragHandle } from './DragHandle';
import { DragHandleEdgeCorner } from './DragHandleEdgeCorner';
import { DragHandleEdgeInnerCorner } from './DragHandleEdgeInnerCorner';
import { DragHandleNode } from './DragHandleNode';

export class DragWrapperGraph implements SvgInterface {
    private bpmnGraph: BpmnGraph;
    constructor(bpmnGraph: BpmnGraph) {
        this.bpmnGraph = bpmnGraph;
    }

    private snapSvgs: SVGElement | undefined;
    updateSvg(): SVGElement {
        const c = Svg.container();
        const cNodes = Svg.container('nodes');
        const cEdges = Svg.container('edges');
        const cDragHandles = Svg.container('dragHandles');

        c.appendChild(Svg.background());

        c.onmouseup = (event) => {
            this.stopDrag(event);
        };
        c.onmousemove = (event) => {
            this.drag(event);
        };

        const nodeDHs: Map<BpmnNode, DragHandleNode> = new Map(); 
        for (const n of this.bpmnGraph.nodes) {
            const dragHandle = new DragHandleNode(n, this);
            cNodes.appendChild(n.updateSvg());
            cDragHandles.appendChild(dragHandle.updateSvg());

            nodeDHs.set(n, dragHandle);
        }

        for (const e of this.bpmnGraph.edges) {
            cEdges.appendChild(e.updateSvg());

            for (const [i, corner] of e.corners.entries()) {
                let dragHandle;
                if (i == 0) {
                    dragHandle = new DragHandleEdgeInnerCorner(corner, e, this);
                    nodeDHs.get(e.from)?.addDraggedAlong(dragHandle)
                } else if (i == e.corners.length - 1) {
                    dragHandle = new DragHandleEdgeInnerCorner(corner, e, this);
                    nodeDHs.get(e.to)?.addDraggedAlong(dragHandle)
                } else {
                    dragHandle = new DragHandleEdgeInnerCorner(corner, e, this);
                }
                cDragHandles.appendChild(dragHandle.updateSvg());
            }
        }

        this.snapSvgs = Svg.container('snapSvgs');
        c.appendChild(cNodes);
        c.appendChild(this.snapSvgs);
        c.appendChild(cDragHandles);
        c.appendChild(cEdges);
        return c;
    }

    private dragHandle: DragHandle<Position> | undefined;

    startDrag(event: MouseEvent, dh: DragHandle<Position>) {
        this.dragHandle = dh;
        this.dragHandle.startDrag(event);
        this.dragHandle.addSnapElement(new SnapX(100));
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
