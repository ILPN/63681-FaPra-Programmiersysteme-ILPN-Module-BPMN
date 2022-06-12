import { Utility } from "../Utility"
import { DragHelper } from "./DragHelpers/DragHelper"
import { Element } from "./element"
import { ArrowCorner } from "./elements/arrow/ArrowCorner"
import { Vector } from "./elements/arrow/Vector"
import { MainElement } from "./elements/MainElement"
import { MainElementDragHelper } from "./DragHelpers/MainElementDragHelper"

export class MyDiagram{
    removeAndRender(corner: ArrowCorner) {
        corner.updateSvg().remove()
        this.elements = this.elements.filter(e => e != corner)
    }
    addAndRender(element: Element) {
        this.addElement(element)
        //render
    }

    private dragHelper: DragHelper<Element> | undefined
    onChildrenMouseDown(e: MouseEvent, element: Element) {
        if(element instanceof MainElement){
            this.dragHelper = new MainElementDragHelper()
            this.dragHelper.startDrag(element,e)
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
        background.setAttribute('fill', 'white');
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
