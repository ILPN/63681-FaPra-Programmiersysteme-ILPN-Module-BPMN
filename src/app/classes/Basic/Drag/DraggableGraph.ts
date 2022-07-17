import { LayoutService } from 'src/app/services/layout.service';
import { ParserService } from 'src/app/services/parser.service';
import { Utility } from '../../Utils/Utility';
import { BpmnDummyEdgeCorner } from '../Bpmn/BpmnEdge/BpmnDummyEdgeCorner';
import { BpmnEdgeCorner } from '../Bpmn/BpmnEdge/BpmnEdgeCorner';
import { BpmnGraph } from '../Bpmn/BpmnGraph';
import { BpmnNode } from '../Bpmn/BpmnNode';
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
    constructor(bpmnGraph: BpmnGraph, layoutService:LayoutService, rootSvg:SVGElement,drawingArea:SVGElement, private _parserService:ParserService) {
        this.bpmnGraph = bpmnGraph;
        this.dragManager = new DragManager(rootSvg,drawingArea)
        this.dragManager.onStopDrag = (dh)=>{
            if(!Utility.positionsAreEqual(dh.dragedElement.getPos(),dh.startPos)){
    
                const nodes: BpmnNode[] = []
            let dummyNodes: BpmnDummyEdgeCorner[] =[]
            let edgeEnds: BpmnEdgeCorner[]=[]
            let edgeStarts: BpmnEdgeCorner[]=[]

            let dragedDhs = []
            dragedDhs.push(dh)
            dragedDhs = dragedDhs.concat(dh.dragedAlong)
            for (const dh of dragedDhs) {
                if(dh.dragedElement instanceof BpmnNode){
                    const node = dh.dragedElement
                    nodes.push(node)
                }
                else if(dh.dragedElement instanceof BpmnDummyEdgeCorner){
                    dummyNodes.push(dh.dragedElement)
                }else if(dh.dragedElement instanceof BpmnEdgeCorner){
                    const corner = dh.dragedElement
                    if(corner === corner.edge.corners[0]){
                        edgeStarts.push(corner)
                    }else if(corner === Utility.lastElement(corner.edge.corners)){
                        edgeEnds.push(corner)
                    }
                }
            }
            if(!(nodes.length == 0 && dummyNodes.length ==0 && edgeStarts.length ==0 && edgeEnds.length ==0)){
                this._parserService.positionOfNodesAndEdgesChanged(nodes,dummyNodes,edgeStarts,edgeEnds)
            }
            }
            
        }
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
            for (let i = dEdge.edge.corners.length-2; i > 0; i--) {
                const corner = dEdge.edge.corners[i];
                if(corner instanceof BpmnDummyEdgeCorner) continue
                dEdge.edge.removeCorner(i)
            }
            dEdge.svgManager.redraw()
        }
    }
}
