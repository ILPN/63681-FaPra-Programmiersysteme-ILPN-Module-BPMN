import { Utility } from "../Utility"
import { DragHelper } from "./DragHelpers/DragHelper"
import { Element } from "./element"
import { ArrowCorner } from "./elements/arrow/ArrowCorner"
import { MainElement } from "./elements/MainElement"
import { MainElementDragHelper } from "./DragHelpers/MainElementDragHelper"
import { CornerDragHelper } from "./DragHelpers/CornerDragHelper"
import { ArrowEndCorner } from "./elements/arrow/ArrowEndCorner"
import { DragHelperInterface } from "./DragHelpers/DragHelperInterface"
import { MultiDragHelper } from "./DragHelpers/MultiDragHelper"

export class MyDiagram{
    notifyChange() {
        throw new Error('Method not implemented.')
    }
    removeAndRender(corner: ArrowCorner) {
        corner.updateSvg().remove()
        this.elements = this.elements.filter(e => e != corner)
    }
    addAndRender(element: Element) {
        this.addElement(element)
        //render
    }

    readonly DRAG_TWO_CORNERS = 2

    private dragHelper: DragHelperInterface<Element> | undefined
    onChildrenMouseDown(e: MouseEvent, element: Element, FLAG:number = 0) {
        if(element instanceof MainElement){
            this.dragHelper = new MainElementDragHelper(element)
            this.dragHelper.startDrag(e)
            return
        }
        if(element instanceof ArrowCorner || element instanceof ArrowEndCorner){
            if(FLAG == this.DRAG_TWO_CORNERS){
                this.dragHelper = new MultiDragHelper()
                const multiHelper = this.dragHelper as MultiDragHelper
                const dH1 = new CornerDragHelper(element)
                //dH1.setGrid(10)
                multiHelper.addDragHelper(dH1)
                const dH2 = new CornerDragHelper(element.cornerAfter!)
                //dH2.setGrid(10)
                multiHelper.addDragHelper(dH2)
                multiHelper.startDrag(e)
                return
            }
             const dh  = new CornerDragHelper(element)
             dh.setSnapToNeighbour(true)
            this.dragHelper = dh
            this.dragHelper.startDrag(e)
            return
        }
    }
    onChildrenMouseUp(e: MouseEvent, element: Element) {
        this.dragHelper?.stopDrag()
    }
    onChildrenMouseMove(e: MouseEvent, element: Element) {
        this.dragHelper?.dragElement(e)
    }
    public onMousUp(e:MouseEvent){
        this.dragHelper?.stopDrag()
    }
    public onMouseMove(e:MouseEvent){
        this.dragHelper?.dragElement(e)

    }


    private elements:Element[] = []
    getElems(){
        return this.elements
    }
    addElement(el:Element){
        if(this.elements.find((e)=>  (e==el)||(e.id == el.id) )) return
        this.elements.push(el)
    }

    public readonly ID = "DasDiagram"
    public createDiagramSVG():SVGElement{
        const d = Utility.createSvgElement("svg")
        const background = Utility.createSvgElement("rect")
        background.setAttribute('width', `100%`);
        background.setAttribute('height', `100%`);
        background.classList.add("background");
        d.id = this.ID
        d.appendChild(background)
        d.onmouseup = (event) =>{this.onMousUp(event)}
        d.onmousemove = (event) =>{this.onMouseMove(event)}
        

        for (const element of this.elements) {
            d.appendChild(element.updateSvg())
        }
        return d
    }

}
