import {
  AfterViewInit,
Component,
ElementRef,
OnDestroy,
ViewChild,
ViewEncapsulation,
} from '@angular/core';
import { DisplayService } from '../../services/display.service';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../services/layout.service';
import { SvgService } from '../../services/svg.service';
import { BpmnGraph } from 'src/app/classes/Basic/Bpmn/BpmnGraph';
import { DragHandle } from 'src/app/classes/Basic/Drag/DragHandle';
import { BpmnDummyEdgeCorner } from 'src/app/classes/Basic/Bpmn/BpmnEdge/BpmnDummyEdgeCorner';
import { Svg } from 'src/app/classes/Basic/Svg/Svg';
import { VisibleDragHandle } from 'src/app/classes/Basic/Drag/VisibleDragHandle';
import { DragManagerReorder } from 'src/app/classes/Basic/Drag/DragManager/DragManagerReorder';
import { ParserService } from 'src/app/services/parser.service';
import { BpmnNode } from 'src/app/classes/Basic/Bpmn/BpmnNode';
import { BpmnEdge } from 'src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge';
import { BpmnEdgeCorner } from 'src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdgeCorner';
import { Utility } from 'src/app/classes/Utils/Utility';
@Component({
  selector: 'app-display-reorder-graph',
  templateUrl: './display-reorder-graph.component.html',
  styleUrls: ['./display-reorder-graph.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DisplayReorderGraphComponent implements OnDestroy, AfterViewInit {
  @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;
  @ViewChild('rootSvg') rootSvg: ElementRef<SVGElement> | undefined;

  private _sub: Subscription | undefined;
  private bpmnGraph: BpmnGraph | undefined;

  constructor(
      private _layoutService: LayoutService,
      private _svgService: SvgService,
      private _displayService: DisplayService,
      private _parserService: ParserService
  ) {}

  onReset(){
    this.ngAfterViewInit();
}
  ngAfterViewInit(): void {
      this._sub = this._displayService.diagram$.subscribe((graph) => {

          this.bpmnGraph = graph;
          this._parserService.deleteAllCoordinates()
          this._layoutService.applySugiyama(this.bpmnGraph)
          if (this.drawingArea == undefined || this.rootSvg == undefined) return;

          const dragManager = new DragManagerReorder(this.rootSvg.nativeElement,
            this.drawingArea.nativeElement,
            this.drawingArea.nativeElement as SVGGraphicsElement,
            this._layoutService.sugiResult!)
          dragManager.onStopReorderDrag = (reorderdDragHandles) =>{
            const nodes: BpmnNode[] = []
            let edgeCorners: BpmnEdgeCorner[] =[]
            for (const dh of reorderdDragHandles) {
              if(dh.dragedElement instanceof BpmnNode){
                  const node = dh.dragedElement
                  nodes.push(node)
              }
              else if(dh.dragedElement instanceof BpmnEdgeCorner){
                  const corner = dh.dragedElement                      
                  edgeCorners.push(corner)
              }
          }
          if(!(nodes.length == 0 && edgeCorners.length ==0 )){
              this._parserService.positionOfNodesAndEdgesChanged(nodes,edgeCorners)
          }
          
          
          }
          const bpmnGraphSvg = this.bpmnGraph.svgManager.getNewSvg()
          for (const node of this.bpmnGraph.nodes) {
            const dragHandleOfNode = new DragHandle(node)
            dragManager.registerDragHandle(node,dragHandleOfNode)
            for (const edge of node.outEdges) {
                const endOfEdgeHandle = new DragHandle(edge.corners[0])
                endOfEdgeHandle.addCallbackAfterDragTo(()=>edge.svgManager.redraw())
                dragHandleOfNode.addDraggedAlong(endOfEdgeHandle)
            }
            for (const edge of node.inEdges) {
                const endOfEdgeHandle = new DragHandle(edge.corners[edge.corners.length-1])
                endOfEdgeHandle.addCallbackAfterDragTo(()=>edge.svgManager.redraw())
                dragHandleOfNode.addDraggedAlong(endOfEdgeHandle)
            }
            dragHandleOfNode.addCallbackAfterDragTo(()=> node.svgManager.redraw())
            node.svgManager.getSvg().onmousedown = (e) => dragManager.startDrag(e,dragHandleOfNode)
            
           
        }
        const dragHandleSvgs = Svg.container()
        for (const edge of this.bpmnGraph.edges) {
            for (const corner of edge.corners) {
                if(corner instanceof BpmnDummyEdgeCorner){
                    const newDragHandle = new VisibleDragHandle(corner,dragManager)
                    dragManager.registerDragHandle(corner,newDragHandle)
                    newDragHandle.addCallbackAfterDragTo(()=> edge.svgManager.redraw())
                    dragHandleSvgs.appendChild(newDragHandle.svgManager.getSvg())
                }
            }
            
        }


        Utility.removeAllChildren(this.drawingArea.nativeElement)
        this.drawingArea.nativeElement.appendChild(bpmnGraphSvg);
        this.drawingArea.nativeElement.appendChild(dragHandleSvgs);
        this._layoutService.zoomViewToSvg(bpmnGraphSvg, this.drawingArea.nativeElement,this.rootSvg.nativeElement)
      });
      this._parserService.resetCoordinates();

    }

  ngOnDestroy(): void {
      this._sub?.unsubscribe();
  }
}

