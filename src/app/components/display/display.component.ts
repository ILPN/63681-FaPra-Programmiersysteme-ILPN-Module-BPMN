import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { DisplayService } from '../../services/display.service';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../services/layout.service';
import { SvgService } from '../../services/svg.service';
import { BpmnGraph } from 'src/app/classes/Basic/Bpmn/BpmnGraph';
import { DraggableGraph } from 'src/app/classes/Basic/Drag/DraggableGraph';
import { MyTestNode } from 'src/app/classes/Basic/Bpmn/MyTestNode';
import { Vector } from 'src/app/classes/Utils/Vector';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DisplayComponent implements OnDestroy, AfterViewInit {
    @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;

    private _sub: Subscription | undefined
    private _diagram: BpmnGraph | undefined;

    constructor(
        private _layoutService: LayoutService,
        private _svgService: SvgService,
        private _displayService: DisplayService
    ) {
    }

    ngAfterViewInit(): void {
        this._sub = this._displayService.diagram$.subscribe((diagram) => {
            this._diagram = diagram;
            if(this.drawingArea == undefined) return
            //this._layoutService.setViewBox(this.drawingArea.nativeElement)
            //this.draw(diagram.updateSvg());


            const testNOde = new MyTestNode("test")
            testNOde.setPosXY(100,100)
            testNOde.svgManager.getSvg().onclick = ()=>{
                testNOde.setPos(testNOde.getPos().plus(new Vector(10,20)))
                testNOde.svgManager.redraw()
            }
            this.draw(testNOde.svgManager.getSvg())

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
