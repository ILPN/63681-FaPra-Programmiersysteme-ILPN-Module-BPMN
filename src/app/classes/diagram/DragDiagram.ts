import { Utility } from '../Utils/Utility';
import { Element } from './element';
import { ArrowCorner } from './elements/arrow/ArrowCorner';
import { MainElement } from './elements/MainElement';
import { ArrowEndCorner } from './elements/arrow/ArrowEndCorner';
import { LayeredGraph } from '../Sugiyama/LayeredGraph';
import { DragHelperInterface } from './Drag/DragHelpers/DragHelperInterface';
import { MainElementDragHelper } from './Drag/DragHelpers/MainElementDragHelper';
import { MultiDragHelper } from './Drag/DragHelpers/MultiDragHelper';
import { CornerDragHelper } from './Drag/DragHelpers/CornerDragHelper';
import { SnapGrid } from './Drag/SnapElements/SnapGrid';
import { SnapX } from './Drag/SnapElements/SnapX';
import { SnapY } from './Drag/SnapElements/SnapY';
import { OrderDragHelper2 } from './Drag/DragHelpers/OrderDragHelper';
import { DummyNodeCorner } from './elements/arrow/DummyNodeCorner';
import { DragHelper } from './Drag/DragHelpers/DragHelper';

export class DragDiagram {
    private suiyamaResultGraph: LayeredGraph | undefined;
    setSugiyamaResult(result: LayeredGraph) {
        this.suiyamaResultGraph = result;
    }
    private dragHelper: DragHelperInterface<Element> | undefined;
    onChildrenMouseDown(e: MouseEvent, ...els: Element[]) {
        const el = els[0];
        if (el instanceof MainElement || el instanceof DummyNodeCorner) {
            //this.startFreeDragWithSomeSnaps(e,elements);
            this.startReOrderDrag(e, el);
            return;
        }
        if (
            els.length >= 2 &&
            (el instanceof ArrowCorner || el instanceof ArrowEndCorner) &&
            (els[1] instanceof ArrowCorner || els[1] instanceof ArrowEndCorner)
        ) {
            this.startDoubleCornerDrag(e, el, els[1]);
            return;
        }
        if (el instanceof ArrowCorner || el instanceof ArrowEndCorner) {
            this.startCornerDrag(e, el);
            return;
        }
    }
    startCornerDrag(e: MouseEvent, el: ArrowCorner) {
        const dh = new CornerDragHelper(el);
        if (el.cornerBefore != undefined) {
            dh.addSnapElement(new SnapX(el.cornerBefore.x));
            dh.addSnapElement(new SnapY(el.cornerBefore.y));
        }
        if (el.cornerAfter != undefined) {
            dh.addSnapElement(new SnapX(el.cornerAfter.x));
            dh.addSnapElement(new SnapY(el.cornerAfter.y));
        }
        if (el instanceof ArrowEndCorner) {
            //dh.addSnapElement(new SnapPoint(element.intersectingElement.getPos()))
            dh.addSnapElement(new SnapX(el.intersectingElement.x));
            dh.addSnapElement(new SnapY(el.intersectingElement.y));
        }
        this.dragHelper = dh;
        this.svg.appendChild(dh.getSnapSvg());
        this.dragHelper.startDrag(e);
        return;
    }
    startDoubleCornerDrag(e: MouseEvent, el1: ArrowCorner, el2: ArrowCorner) {
        this.dragHelper = new MultiDragHelper();
        const multiHelper = this.dragHelper as MultiDragHelper;
        const dH1 = new CornerDragHelper(el1);
        dH1.addSnapElement(new SnapGrid(10, el1.getPos()));
        multiHelper.addDragHelper(dH1);
        const dH2 = new CornerDragHelper(el2);
        dH2.addSnapElement(new SnapGrid(10, el2.getPos()));
        multiHelper.addDragHelper(dH2);
        multiHelper.startDrag(e);
        return;
    }
    startReOrderDrag(e: MouseEvent, el: MainElement | DummyNodeCorner) {
        let dhOfElement: DragHelper<Element>;
        if (el instanceof MainElement) {
            dhOfElement = new MainElementDragHelper(el);
        } else {
            dhOfElement = new CornerDragHelper(el);
        }

        const dh = new OrderDragHelper2(dhOfElement);
        if (this.suiyamaResultGraph != undefined) {
            const layer = this.suiyamaResultGraph.getNode(el.id)!.layer;
            for (const node of this.suiyamaResultGraph.layers[layer]) {
                const el = this.elements.find((e) => e.id == node.id);
                if (el != undefined) {
                    if (el instanceof MainElement)
                        dh.addDragHelper(new MainElementDragHelper(el));
                    else if (el instanceof DummyNodeCorner) {
                        dh.addDragHelper(new CornerDragHelper(el));
                    }
                }
            }
        }
        this.dragHelper = dh;
        this.dragHelper.startDrag(e);
    }
    startFreeDragWithSomeSnaps(
        e: MouseEvent,
        element: MainElement | DummyNodeCorner
    ) {
        let dh;
        if (element instanceof DummyNodeCorner) {
            dh = new CornerDragHelper(element);
        } else {
            dh = new MainElementDragHelper(element);
        }

        if (this.suiyamaResultGraph != undefined) {
            const layer = this.suiyamaResultGraph.getNode(element.id)!.layer;
            const xOfLayer = this.suiyamaResultGraph.getXOfLayer(layer);
            for (const node of this.suiyamaResultGraph.layers[layer]) {
                dh.addSnapElement(new SnapY(node.y));
            }
            dh.addSnapElement(new SnapX(xOfLayer));
        }
        this.svg.appendChild(dh.getSnapSvg());
        this.dragHelper = dh;
        this.dragHelper.startDrag(e);
    }
    onChildrenMouseUp(e: MouseEvent, element: Element) {
        this.dragHelper?.stopDrag();
    }
    onChildrenMouseMove(e: MouseEvent, element: Element) {
        this.dragHelper?.dragElement(e);
    }
    public onMousUp(e: MouseEvent) {
        this.dragHelper?.stopDrag();
    }
    public onMouseMove(e: MouseEvent) {
        this.dragHelper?.dragElement(e);
    }
    private elements: Element[] = [];
    getElems() {
        return this.elements;
    }
    addElement(el: Element) {
        if (this.elements.find((e) => e == el || e.id == el.id)) return;
        this.elements.push(el);
    }

    public readonly ID = 'DasDiagram';
    public svg = Utility.createSvgElement('svg');
    public createDiagramSVG(): SVGElement {
        const d = Utility.createSvgElement('svg');
        const background = Utility.createSvgElement('rect');
        background.setAttribute('width', `100%`);
        background.setAttribute('height', `100%`);
        background.classList.add('background');
        d.id = this.ID;
        d.appendChild(background);
        d.onmouseup = (event) => {
            this.onMousUp(event);
        };
        d.onmousemove = (event) => {
            this.onMouseMove(event);
        };

        for (const element of this.elements) {
            d.appendChild(element.updateSvg());
        }
        this.svg = d;
        return d;
    }
}
