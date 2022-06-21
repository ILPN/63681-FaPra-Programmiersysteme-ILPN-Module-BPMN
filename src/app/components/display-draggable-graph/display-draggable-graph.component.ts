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
  styleUrls: ['./display-draggable-graph.component.scss', '../bpmn.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayDraggableGraphComponent implements OnDestroy,  AfterViewInit {
  @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;
  @ViewChild('rootSvg') rootSvg: ElementRef<SVGElement> | undefined;

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
            if (this.rootSvg == undefined || this.drawingArea == undefined) return 
            this._diagram = diagram;
                if(!this._layoutService.initalLayoutHasBeenDone){
                    this._layoutService.layout(
                        this._diagram,
                        this.rootSvg!.nativeElement.clientWidth,
                        this.rootSvg!.nativeElement.clientHeight
                    );
                }

                this._layoutService.setViewBox(this.drawingArea.nativeElement)
                
                const dg = new DraggableGraph(diagram, this._layoutService, this.rootSvg!.nativeElement);
  
                this.draw(dg.svgManager.getSvg());
                
                //this.draw(this._diagram.createDiagramSVG());
                //const g = BpmnGraph.sampleGraph()
                
                //this.draw(diagram.updateSvg());
            
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
