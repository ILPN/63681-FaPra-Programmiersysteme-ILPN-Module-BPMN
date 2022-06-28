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
import { DragManager } from './DragManager/DragManager';
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
    private dragManager: DragManager
    constructor(bpmnGraph: BpmnGraph, layoutService:LayoutService, rootSvg:SVGElement,drawingArea:SVGElement) {
        this.bpmnGraph = bpmnGraph;
        this.dragManager = new DragManager(rootSvg,drawingArea)
        this.convertToDraggableNodesAndEdges()
        this.attachSnapings(layoutService)

    }
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
                    this.dragManager.registerDragHandle(corner, newDragHandle)
                }                
            }
        }
    }
    convertToDraggableNodesAndEdges() {
        this.dEdges = this.bpmnGraph.edges.map((e,i)=>{
            const dragableEdge = new DraggableEdge(e,this.dragManager)
            return dragableEdge
        })
        this.dNodes = this.bpmnGraph.nodes.map((n,i)=>{
            const dragableNode: DraggableNode = new DraggableNode(n,this.dragManager)
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

        c.appendChild(cNodes);
        c.appendChild(cEdges);
        return c;
    }

    deleteAllCorners(){
        for (const dEdge of this.dEdges) {
            for (const [i,corner] of dEdge.edge.corners.entries()) {
                if(i == 0) continue
                if(i == dEdge.edge.corners.length-1) continue
                if(corner instanceof BpmnDummyEdgeCorner) continue
                dEdge.edge.removeCorner(i)
                dEdge.svgManager.redraw()
            }
        }
    }
}
