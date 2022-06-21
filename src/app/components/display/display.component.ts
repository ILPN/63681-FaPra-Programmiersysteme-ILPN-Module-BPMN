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
import { BpmnTaskBusinessRule } from 'src/app/classes/Basic/Bpmn/tasks/BpmnTaskBusinessRule';
import { BpmnEventEnd } from 'src/app/classes/Basic/Bpmn/events/BpmnEventEnd';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss', '../bpmn.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DisplayComponent implements OnDestroy, AfterViewInit {
    @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;

    private _sub: Subscription | undefined;
    private _diagram: BpmnGraph | undefined;

    constructor(
        private _layoutService: LayoutService,
        private _svgService: SvgService,
        private _displayService: DisplayService
    ) {}

    ngAfterViewInit(): void {
        this._sub = this._displayService.diagram$.subscribe((diagram) => {
            this._diagram = diagram;
            if (this.drawingArea == undefined) return;
            //this._layoutService.setViewBox(this.drawingArea.nativeElement)
            //this.draw(diagram.updateSvg());

            const testNode = new BpmnTaskBusinessRule('test');
            testNode.label = 'This is a Test';
            testNode.setPosXY(100, 100);
            let selected = true;
            testNode.svgManager.getSvg().onclick = () => {
                testNode.setPos(testNode.getPos().plus(new Vector(20, 20)));
                testNode.svgManager.setCssClasses(selected ? 'selected' : '');
                selected = !selected;

                testNode.svgManager.redraw();
            };
            const event = new BpmnEventEnd('test');
            event.label = 'This is the dude';
            event.setPosXY(200, 100);
            let selectedevent = true;
            event.svgManager.getSvg().onclick = () => {
                event.setPos(event.getPos().plus(new Vector(10, 0)));
                event.svgManager.setCssClasses(selectedevent ? 'selected' : '');
                selectedevent = !selectedevent;

                event.svgManager.redraw();
            };

            this.draw(testNode.svgManager.getSvg(), event.svgManager.getSvg());
        });
    }

    ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }

    private draw(...svgs: SVGElement[]) {
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
