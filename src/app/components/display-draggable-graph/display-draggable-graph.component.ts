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

@Component({
  selector: 'app-display-draggable-graph',
  templateUrl: './display-draggable-graph.component.html',
  styleUrls: ['./display-draggable-graph.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayDraggableGraphComponent implements OnDestroy,  AfterViewInit {
  @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;

  private _sub: Subscription |  undefined;
  private _diagram: BpmnGraph | undefined;

  constructor(
      private _layoutService: LayoutService,
      private _svgService: SvgService,
      private _displayService: DisplayService
  ) {
     
  }
    ngAfterViewInit(): void {
        this._sub = this._displayService.diagram$.subscribe((diagram) => {
            if(diagram == undefined)return
            if(diagram.isEmpty())return
            this._diagram = diagram;
            if (this.drawingArea != undefined) {
                if(!this._layoutService.initalLayoutHasBeenDone){
                    this._layoutService.layout(
                        this._diagram,
                        this.drawingArea.nativeElement
                    );
                }
                this._layoutService.setViewBox(this.drawingArea.nativeElement)
                
                const dg = new DraggableGraph(diagram, this._layoutService);
  
                this.draw(dg.updateSvg());
                
                //this.draw(this._diagram.createDiagramSVG());
                //const g = BpmnGraph.sampleGraph()
                
                //this.draw(diagram.updateSvg());
            }
        });
    }

  ngOnDestroy(): void {
      this._sub?.unsubscribe();
  }

  private draw(svg: SVGElement) {
      if (this.drawingArea === undefined) {
          console.debug('drawing area not ready yet');
          return;
      }
      console.log('draw is called');

      this.clearDrawingArea();

      this.drawingArea.nativeElement.appendChild(svg);

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
