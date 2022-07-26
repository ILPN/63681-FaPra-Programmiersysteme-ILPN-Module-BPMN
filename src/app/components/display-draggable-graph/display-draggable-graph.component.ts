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
        this._draggableGraph?.deleteAllCorners();
    }

    onMakeSquare() {
        console.log('MakeSquare clicked');
    }
    ngAfterViewInit(): void {
        this._sub = this._displayService.diagram$.subscribe((bpmnGraph) => {
            if (bpmnGraph == undefined) return;
            if (bpmnGraph.isEmpty()) return;
            if (this.rootSvg == undefined || this.drawingArea == undefined)
                return;
            this._bpmnGraph = bpmnGraph;

            this._layoutService.layoutIfNeeded(
                this._bpmnGraph,
                this.rootSvg.nativeElement.clientWidth,
                this.rootSvg.nativeElement.clientHeight
            );
            this._layoutService.setViewBox(this.drawingArea.nativeElement);

            this._draggableGraph = new DraggableGraph(
                bpmnGraph,
                this._layoutService,
                this.rootSvg!.nativeElement,
                this.drawingArea.nativeElement,
                this._parserService
            );
            Utility.removeAllChildren(this.drawingArea.nativeElement);
            this.drawingArea.nativeElement.appendChild(
                this._draggableGraph.svgManager.getSvg()
            );
        });
    }

    ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }
}
