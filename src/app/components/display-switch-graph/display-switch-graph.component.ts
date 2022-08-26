import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Injectable, Output, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import { BpmnGraph } from 'src/app/classes/Basic/Bpmn/BpmnGraph';
import { SwitchableGraph } from 'src/app/classes/Basic/Switch/SwitchableGraph';
import { DisplayErrorService } from 'src/app/services/display-error.service';
import { DisplayService } from 'src/app/services/display.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SvgService } from 'src/app/services/svg.service';

@Component({
    selector: 'app-display-switch-graph',
    templateUrl: './display-switch-graph.component.html',
    styleUrls: ['./display-switch-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DisplaySwitchGraphComponent implements OnDestroy, AfterViewInit {
    @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;
    @ViewChild('rootSvg') rootSvg: ElementRef<SVGElement> | undefined;

    // @Output() wellHandledTextEvent = new EventEmitter<string>();
    // public wellHandledText = new EventEmitter<string>();

    private _sub: Subscription | undefined;
    private bpmnGraph: BpmnGraph | undefined;
    private _switchableGraph: SwitchableGraph | undefined;
    // textForWellhandled : String = "";
    // isWellhandled : boolean = true;

    constructor(
        private _layoutService: LayoutService,
        private _svgService: SvgService,
        private _displayService: DisplayService
    ) {
    }

    ngAfterViewInit(typ?: number): void {
        this._sub = this._displayService.diagram$.subscribe((graph) => {
            if (graph == undefined) return
            if (graph.isEmpty()) return
            if (this.rootSvg == undefined || this.drawingArea == undefined) return
            this.bpmnGraph = graph;
            const switchGraph = new SwitchableGraph(graph, 0);
            if (typeof typ !== 'undefined') {
                const switchGraph = new SwitchableGraph(graph, 1);
            }
            this._switchableGraph = switchGraph;
            this.draw(switchGraph.svgManager.getSvg())
            const svg = switchGraph.svgManager.getSvg()
            this.draw(svg)
            this._layoutService.zoomViewToSvg(svg, this.drawingArea.nativeElement, this.rootSvg.nativeElement)


            //if(switchGraph.controller.checkIsWellHandled() === "") 
            //  this.isWellhandled = true;
        });
    }

    wellHandledCheck() {
        let str: string = "";
        if (this._switchableGraph !== undefined) {
            str = this._switchableGraph.controller.checkIsWellHandled();
            if (str === "") str = "Dieser Graph ist well-handled.";
        } else str = "Die Überprüfung ist fehlgeschalgen.";
        // //(new DisplayErrorService()).displayError(str);
        // this.wellHandledText.emit("Hallo mein Name ist Hase");
        //  this.wellHandledText.pipe().subscribe((val) => this.wellHandledText = val);
        // // this._subError = this._parserService.textareaError.pipe(debounceTime(400))
        // //     .subscribe((val) => this.textareaError = val);

    }

    classic(): void {
        this.ngAfterViewInit();
    }

    recent(): void {
        this.ngAfterViewInit(1);
    }


    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }

    private draw(svg: SVGElement) {
        if (this.drawingArea === undefined) {
            console.debug('drawing area not ready yet');
            return;
        }
        this.clearDrawingArea();
        this.drawingArea.nativeElement.appendChild(svg);
    }

    private clearDrawingArea() {
        const drawingArea = this.drawingArea?.nativeElement;
        if (drawingArea?.childElementCount === undefined) {
            return;
        }

        while (drawingArea.childElementCount > 0) {
            drawingArea.removeChild(drawingArea.lastChild as ChildNode);
        }
    }

}
