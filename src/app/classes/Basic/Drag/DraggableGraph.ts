import { LayoutService } from 'src/app/services/layout.service';
import { ParserService } from 'src/app/services/parser.service';
import { Utility } from '../../Utils/Utility';
import { Vector } from '../../Utils/Vector';
import { BpmnDummyEdgeCorner } from '../Bpmn/BpmnEdge/BpmnDummyEdgeCorner';
import { BpmnEdge } from '../Bpmn/BpmnEdge/BpmnEdge';
import { BpmnEdgeCorner } from '../Bpmn/BpmnEdge/BpmnEdgeCorner';
import { BpmnGraph } from '../Bpmn/BpmnGraph';
import { BpmnNode } from '../Bpmn/BpmnNode';
import { GetSvgManager } from '../Interfaces/GetSvgManager';
import { Svg } from '../Svg/Svg';
import { SvgManager } from '../Svg/SvgManager/SvgManager';
import { DraggableEdge } from './DraggableEdge';
import { DragHandle } from './DragHandle';
import { DragManager } from './DragManager/DragManager';

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
    constructor(bpmnGraph: BpmnGraph, private layoutService:LayoutService, rootSvg:SVGElement,drawingArea:SVGElement, private _parserService:ParserService) {
        this.bpmnGraph = bpmnGraph;
        this.dragManager = new DragManager(rootSvg,drawingArea,drawingArea as SVGGraphicsElement)
        this.dragManager.onStopDrag = (dh)=>{
            if(!dh.dragedElement.getPos().equals(dh.startPos)){
    
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
        this.makeDraggable()
        this.addSnapingsForDummyNodes()

    }
    private addSnapingsForDummyNodes() {
        //for dummyNodes
        for (const [e,de] of this.dEdges.entries()) {
            for (const corner of de.edge.corners) {
                if(corner instanceof BpmnDummyEdgeCorner){
                    const newDragHandle = new DragHandle(corner)
                    newDragHandle.addCallbackAfterDragTo(()=>de.svgManager.redraw())
                    newDragHandle.addSnapElements(this.layoutService.getSnapsForNode())
                    this.dragManager.registerDragHandle(corner, newDragHandle)
                }                
            }
        }
    }
    bpmnGraphSvg:SVGElement|undefined
    private makeDraggable() {
        this.bpmnGraphSvg = this.bpmnGraph.svgManager.getNewSvg()
        for (const edge of this.bpmnGraph.edges) {
            this.dEdges.set(edge,new DraggableEdge(edge,this.dragManager))
        }
        const dragManager = this.dragManager
        for (const node of this.bpmnGraph.nodes) {
            const dragHandleOfNode = new DragHandle(node)
            dragHandleOfNode.addSnapElements(this.layoutService.getSnapsForNode())
            dragManager.registerDragHandle(node,dragHandleOfNode)
            for (const edge of node.outEdges) {
                const endOfEdgeHandle = new DragHandle(edge.corners[0])
                endOfEdgeHandle.addCallbackAfterDragTo(()=>this.dEdges.get(edge)!.svgManager.redraw())
                dragHandleOfNode.addDraggedAlong(endOfEdgeHandle)
            }
            for (const edge of node.inEdges) {
                const endOfEdgeHandle = new DragHandle(edge.corners[edge.corners.length-1])
                endOfEdgeHandle.addCallbackAfterDragTo(()=>this.dEdges.get(edge)!.svgManager.redraw())
                dragHandleOfNode.addDraggedAlong(endOfEdgeHandle)
            }
            dragHandleOfNode.addCallbackAfterDragTo(()=> node.svgManager.redraw())
            node.svgManager.getSvg().onmousedown = (e) => {
                dragManager.startDrag(e,dragHandleOfNode)
            }
        }
    }
    public  dEdges: Map<BpmnEdge,DraggableEdge> = new Map()
    svgCreation(): SVGElement {
        const c = Svg.container();
        const cEdges = Svg.container('draggableEdges');

        for (const [e, de] of this.dEdges.entries()) {
            cEdges.appendChild(de.svgManager.getSvg());
        }

        if(this.bpmnGraphSvg) c.appendChild(this.bpmnGraphSvg)
        c.appendChild(cEdges);
        return c;
    }
}
