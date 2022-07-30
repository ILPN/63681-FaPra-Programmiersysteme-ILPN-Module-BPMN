import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BpmnGraph } from 'src/app/classes/Basic/Bpmn/BpmnGraph';
import { SwitchableGraph } from 'src/app/classes/Basic/Switch/SwitchableGraph';
import { DisplayService } from 'src/app/services/display.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SvgService } from 'src/app/services/svg.service';
import {GraphValidationService} from "../../services/graph-validation.service";
import {SwitchableNode} from "../../classes/Basic/Switch/SwitchableNode";

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
  private bpmnGraph: BpmnGraph | undefined;

  constructor(
    private _layoutService: LayoutService,
    private _svgService: SvgService,
    private _displayService: DisplayService,
    private graphValidationService: GraphValidationService
  ) { }

  ngAfterViewInit(): void {
    this._sub = this._displayService.diagram$.subscribe((graph) => {
      if (graph == undefined) return
      if (graph.isEmpty()) return
      if (this.rootSvg == undefined || this.drawingArea == undefined) return
      this.bpmnGraph = graph;
           const switchGraph = new SwitchableGraph(graph);
      this.validateGraph(switchGraph)

      const svg = switchGraph.svgManager.getSvg()
      this.draw(svg)
      this._layoutService.zoomViewToSvg(svg, this.drawingArea.nativeElement,this.rootSvg.nativeElement)


    });
  }
    private validateGraph(graph:SwitchableGraph) {
        this.graphValidationService.validateGraph(graph);
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
