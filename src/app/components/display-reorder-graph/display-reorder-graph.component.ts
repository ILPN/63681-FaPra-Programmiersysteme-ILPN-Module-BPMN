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
import { BpmnTaskBusinessRule } from 'src/app/classes/Basic/Bpmn/tasks/BpmnTaskBusinessRule';
import { Vector } from 'src/app/classes/Utils/Vector';
import { BpmnEventEnd } from 'src/app/classes/Basic/Bpmn/events/BpmnEventEnd';
import { DragManager } from 'src/app/classes/Basic/Drag/DragManager';
@Component({
  selector: 'app-display-reorder-graph',
  templateUrl: './display-reorder-graph.component.html',
  styleUrls: ['./display-reorder-graph.component.scss']
})
export class DisplayReorderGraphComponent implements OnDestroy, AfterViewInit {
  @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;
  @ViewChild('rootSvg') rootSvg: ElementRef<SVGElement> | undefined;

  private _sub: Subscription | undefined;
  private bpmnGraph: BpmnGraph | undefined;

  constructor(
      private _layoutService: LayoutService,
      private _svgService: SvgService,
      private _displayService: DisplayService
  ) {}

  ngAfterViewInit(): void {
      this._sub = this._displayService.diagram$.subscribe((graph) => {
          this.bpmnGraph = graph;
          if (this.drawingArea == undefined || this.rootSvg == undefined) return;
          this._layoutService.setViewBox(this.drawingArea.nativeElement)
          const dragManager = new DragManager(this.rootSvg.nativeElement,this.drawingArea.nativeElement)
//         
          this.draw([this.bpmnGraph.svgManager.getNewSvg()]);
      });
  }

  ngOnDestroy(): void {
      this._sub?.unsubscribe();
  }

  private draw(svgs: SVGElement[]) {
      if (this.drawingArea === undefined) {
          console.debug('drawing area not ready yet');
          return;
      }
      console.log('draw is called');

      this.clearDrawingArea();

      for (const svg of svgs) {
          this.drawingArea.nativeElement.appendChild(svg);
      }

      /*
      const elements = this._svgService.createSvgElements(this._displayService.diagram);
      for (const element of elements) {
          this.drawingArea.nativeElement.appendChild(element);
      }
      */

      /*const el1 = new Gateway("1", GatewayType.AND_JOIN)
     const el2 = new MyElement("2")

     this.drawingArea.nativeElement.appendChild(el1.getSVGThatWillBeAttachedToDom())
     this.drawingArea.nativeElement.appendChild(el2.getSvgWithListeners())
      */
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

