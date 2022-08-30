import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Injectable, Output, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import { BpmnGraph } from 'src/app/classes/Basic/Bpmn/BpmnGraph';
import { SwitchableGraph } from 'src/app/classes/Basic/Switch/SwitchableGraph';
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

    private _sub: Subscription | undefined;
    private _bpmnGraph: BpmnGraph | undefined;
    private _switchableGraph: SwitchableGraph | undefined;
    textForWellhandled : String = "";

    constructor(
        private _layoutService: LayoutService,
        private _svgService: SvgService,
        private _displayService: DisplayService
    ) {
        this.textForWellhandled = "";
    }

    ngAfterViewInit(typ?: number): void {
        console.log("ngAfterViewInit")
        this._sub = this._displayService.diagram$.subscribe((graph) => {
            this.textForWellhandled = "";
            if (graph == undefined) return
            if (graph.isEmpty()) return
            if (this.rootSvg == undefined || this.drawingArea == undefined) return
            this._bpmnGraph = graph;
            let selectedTyp : number = 0; 
            if (typeof typ !== 'undefined') selectedTyp = 1;
            const switchGraph = new SwitchableGraph(graph, selectedTyp);
            this.showSelectedTyp(selectedTyp);
            this._switchableGraph = switchGraph;
            this.draw(switchGraph.svgManager.getSvg())
            const svg = switchGraph.svgManager.getSvg()
            this.draw(svg)
            this._layoutService.zoomViewToSvg(svg, this.drawingArea.nativeElement, this.rootSvg.nativeElement)
        });
    }

    private showSelectedTyp(selectedTyp : number) {
        let enabledId : string  = selectedTyp ===0? "classicButton" : "modernButton";
        let disabledId : string = selectedTyp ===0? "modernButton"  : "classicButton";
       const enabledButton = document.getElementById(enabledId);  
       const disabledButton = document.getElementById(disabledId); 
       if(enabledButton) enabledButton.style.backgroundColor = "rgb(88, 104, 104)";
       if(disabledButton) disabledButton.style.backgroundColor = "cadetblue";
    }

    wellHandledCheck() {
        if (this._switchableGraph !== undefined) {
            let check = this._switchableGraph.controller.checkIsWellHandled();
            if (check !== "")  this.textForWellhandled = check; 
        } else { this.textForWellhandled = "Der Graph existiert nicht"; }
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
        setTimeout(() => {
            this.wellHandledCheck();
        },0)
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
