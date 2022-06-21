import { LayoutService } from 'src/app/services/layout.service';
import { BpmnDummyEdgeCorner } from '../Bpmn/BpmnEdge/BpmnDummyEdgeCorner';
import { BpmnGraph } from '../Bpmn/BpmnGraph';
import { GetSvgManager } from '../Interfaces/GetSvgManager';
import { Position } from '../Interfaces/Position';
import { Svg } from '../Svg/Svg';
import { SvgManager } from '../Svg/SvgManager/SvgManager';
import { DraggableEdge } from './DraggableEdge';
import { DraggableNode } from './DraggableNode';
import { DragHandle } from './DragHandle';
import { SnapElement } from './SnapElements/SnapElement';

export class DraggableGraph implements GetSvgManager {
    private _svgManager: SvgManager | undefined;
    public get svgManager(): SvgManager {
        if(this._svgManager == undefined){
            this._svgManager = new SvgManager("DraggableGraph",() => this.svgCreation())
        }
        return this._svgManager;
    }
    
    private bpmnGraph: BpmnGraph;
    constructor(bpmnGraph: BpmnGraph, layoutService:LayoutService, rootSvg:SVGElement) {
        this.bpmnGraph = bpmnGraph;
        this.convertToDraggableNodesAndEdges()
        this.attachListenersForDragging(rootSvg)
        this.attachSnapings(layoutService)

    }
    private dragHandles: Map<any,DragHandle> = new Map() // homeless dragHandles
    attachSnapings(layoutService:LayoutService) {

        //for nodes
        for (const dn of this.dNodes) {
            dn.dragHandle.addSnapElements(layoutService.getSnapsFor(dn.node.id))

        }

        //for dummyNodes
        for (const de of this.dEdges) {
            for (const corner of de.edge.corners) {
                if(corner instanceof BpmnDummyEdgeCorner){
                    const newDragHandle = new DragHandle(corner)
                    newDragHandle.addCallbackAfterDragTo(()=>de.svgManager.redraw())
                    newDragHandle.addSnapElements(layoutService.getSnapsFor(corner.id))
                    this.dragHandles.set(corner, newDragHandle)
                }                
            }
        }
    }
    attachListenersForDragging(rootSvg: SVGElement) {
        rootSvg.onmouseup = (event) => {
            this.stopDrag(event);
        };
        rootSvg.onmousemove = (event) => {
            this.drag(event);
        };
    }
    convertToDraggableNodesAndEdges() {
        this.dEdges = this.bpmnGraph.edges.map((e,i)=>{
            const dragableEdge = new DraggableEdge(e,this)
            return dragableEdge
        })
        this.dNodes = this.bpmnGraph.nodes.map((n,i)=>{
            const dragableNode: DraggableNode = new DraggableNode(n,this)
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
    svgCreation(): SVGElement {
        const c = Svg.container();
        const cNodes = Svg.container('nodes');
        const cEdges = Svg.container('edges');
        

        for (const n of this.dNodes) {
            cNodes.appendChild(n.node.svgManager.getSvg());
        }

        
        for (const e of this.dEdges) {
            cEdges.appendChild(e.svgManager.getSvg());
        }

        this.snapSvgs = Svg.container('snapSvgs');
        c.appendChild(cNodes);
        c.appendChild(this.snapSvgs);
        c.appendChild(cEdges);
        return c;
    }

    private dragedDragHandle: DragHandle | undefined;

    startDragWithObj(event:MouseEvent,obj:any){
        const dragHandle = this.dragHandles.get(obj)
        if(dragHandle == undefined){
            console.log("sorry couldn t find a dragHandle for that obj")
            return
        }
        this.startDrag(event,dragHandle)
    }
    startDrag(event: MouseEvent, dh: DragHandle ) {
        this.dragedDragHandle = dh;
        this.dragedDragHandle.startDrag(event);
        this.snapSvgs?.appendChild(dh.getSnapSvg());
    }
    drag(event: MouseEvent) {
        this.dragedDragHandle?.draging(event);
    }
    stopDrag(event: MouseEvent) {
        this.dragedDragHandle?.stopDrag();
        this.dragedDragHandle = undefined;
    }
}
