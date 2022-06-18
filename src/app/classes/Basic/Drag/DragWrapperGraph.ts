
import { SnapX } from '../../diagram/Drag/SnapElements/SnapX';
import { BpmnGraph } from '../BpmnGraph';
import { SvgInterface } from '../Interfaces/SvgInterface';
import { Svg } from '../Svg/Svg';
import { Dragable } from './Dragable';
import { DragHandle } from './DragHandle';

export class DragWrapperGraph implements SvgInterface {
    private bpmnGraph: BpmnGraph;
    constructor(bpmnGraph: BpmnGraph) {
        this.bpmnGraph = bpmnGraph;
    }

    private dragables: Map<any,Dragable> = new Map()
    private snapSvgs: SVGElement|undefined
    updateSvg(): SVGElement {
        const c = Svg.container();
        c.appendChild(Svg.background());

        c.onmouseup = (event) => {
            this.stopDrag(event);
        };
        c.onmousemove = (event) => {
            this.drag(event);
        };

        const cForDragHandles = Svg.container()
        


        const n = this.bpmnGraph.nodes[0];
            const dh = new DragHandle(n,this);
            c.appendChild(n.updateSvg());
            cForDragHandles.appendChild(dh.updateSvg())

        for (let i = 1; i < this.bpmnGraph.nodes.length; i++) {
            const n = this.bpmnGraph.nodes[i];
            const dragHandle = new DragHandle(n,this);
            dragHandle.addDraggedAlong(dh)
            c.appendChild(n.updateSvg());
            cForDragHandles.appendChild(dragHandle.updateSvg())
        }



        for (const e of this.bpmnGraph.edges) {
            //const dragWrapper = new DragWrapperBpmnEdge(e, this);
            c.appendChild(e.updateSvg());
        }

        this.snapSvgs = Svg.container("snapSvgs")
        c.appendChild(this.snapSvgs)
        c.appendChild(cForDragHandles)
        return c;
    }

    private dragHandle: DragHandle | undefined;

    startDrag(event: MouseEvent, dh: DragHandle) {
        this.dragHandle = dh
        this.dragHandle.startDrag(event);

        this.dragHandle.addSnapElement(new SnapX(100))
        this.snapSvgs?.appendChild(dh.getSnapSvg())
    }  
    drag(event: MouseEvent) {
        this.dragHandle?.dragElement(event);
    }
    stopDrag(event: MouseEvent) {
        this.dragHandle?.stopDrag();
        this.dragHandle = undefined;
    }
}
