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
import { DraggableGraph } from 'src/app/classes/Basic/Drag/DraggableGraph';
import { Utility } from 'src/app/classes/Utils/Utility';
import { ParserService } from 'src/app/services/parser.service';
import { Vector } from 'src/app/classes/Utils/Vector';
import { BpmnEdgeCorner } from 'src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdgeCorner';
import { BpmnDummyEdgeCorner } from 'src/app/classes/Basic/Bpmn/BpmnEdge/BpmnDummyEdgeCorner';

@Component({
    selector: 'app-display-draggable-graph',
    templateUrl: './display-draggable-graph.component.html',
    styleUrls: ['./display-draggable-graph.component.scss', '../bpmn.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DisplayDraggableGraphComponent
    implements OnDestroy, AfterViewInit
{
    @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;
    @ViewChild('rootSvg') rootSvg: ElementRef<SVGElement> | undefined;

    private _sub: Subscription | undefined;
    private _bpmnGraph: BpmnGraph | undefined;
    private _draggableGraph: DraggableGraph | undefined;

    constructor(
        private _layoutService: LayoutService,
        private _parserService: ParserService,
        private _displayService: DisplayService
    ) {}

    onDeleteAllCorners() {
        if(this._draggableGraph == undefined) return
        for (const [edge, dEdge] of this._draggableGraph.dEdges.entries()) {
            for (let i = dEdge.edge.corners.length-2; i > 0; i--) {
                const corner = dEdge.edge.corners[i];
                if(corner instanceof BpmnDummyEdgeCorner) continue
                dEdge.edge.removeCorner(i)
            }
            dEdge.svgManager.redraw()
            this._parserService.positionOfNodesAndEdgesChanged([],dEdge.edge.corners)

        }
    }

    onMakeSquare() {
        if(this._draggableGraph == undefined) return
        for (const [e,dEdge] of this._draggableGraph.dEdges.entries()) {
            const corners = [...dEdge.edge.corners]
            for (let i = 0; i < corners.length-1; i++) {
                const c1 = corners[i];
                const c2 = corners[i+1];
                if(c1.y !== c2.y){
                    const cs = [c1,c2]
                    cs.sort((a,b) => a.y-b.y)
                    const pos = new Vector(cs[0].x, cs[1].y)
                    const indexOfC2 =  c2.edge.corners.indexOf(c2)
                    dEdge.addCorner(indexOfC2, pos)
                }
            }
            dEdge.svgManager.redraw()
        }
    }
    ngAfterViewInit(): void {
        this._sub = this._displayService.diagram$.subscribe((bpmnGraph) => {
            if (bpmnGraph == undefined) return;
            if (bpmnGraph.isEmpty()) return;
            if (this.rootSvg == undefined || this.drawingArea == undefined)
                return;

            this._bpmnGraph = bpmnGraph;
            this._draggableGraph = new DraggableGraph(
                bpmnGraph,
                this._layoutService,
                this.rootSvg.nativeElement,
                this.drawingArea.nativeElement,
                this._parserService
            );

            Utility.removeAllChildren(this.drawingArea.nativeElement);
            const svg =this._draggableGraph.svgManager.getSvg()
            this.drawingArea.nativeElement.appendChild(svg);
            this._layoutService.zoomViewToSvg(svg, this.drawingArea.nativeElement,this.rootSvg.nativeElement);
        });

    }

    ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }
}
