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
import { SnapX } from "./DragHelpers/SnapX"
import { SnapY } from "./DragHelpers/SnapY"
import { SnapPoint } from "./DragHelpers/SnapPoint"
import { SnapGrid } from "./DragHelpers/SnapGrid"
import { LayeredGraph } from "../Sugiyama/LayeredGraph"
import { OrderDragHelper } from "./DragHelpers/OrderDragHelper"

export class MyDiagram{

    private suiyamaResultGraph:LayeredGraph|undefined
    setSugiyamaResult(result:LayeredGraph){
        this.suiyamaResultGraph = result
    }

    removeAndRender(corner: ArrowCorner) {
        corner.updateSvg().remove()
        this.elements = this.elements.filter(e => e != corner)
    }

    readonly DRAG_TWO_CORNERS = 2

    private dragHelper: DragHelperInterface<Element> | undefined
    onChildrenMouseDown(e: MouseEvent, element: Element, FLAG:number = 0) {
        if(element instanceof MainElement){

            /*
            const dh= new MainElementDragHelper(element)
            if(this.suiyamaResultGraph!= undefined){
                const layer = this.suiyamaResultGraph.getNode(element.id)!.layer
                const xOfLayer = this.suiyamaResultGraph.getXOfLayer(layer)
                for (const node of this.suiyamaResultGraph.layers[layer]) {
                    dh.addSnapElement(new SnapY(node.y))
                }
                dh.addSnapElement(new SnapX(xOfLayer))

            }
            this.svg.appendChild(dh.getSnapSvg())
             this.dragHelper = dh*/

             const dh= new OrderDragHelper(element)
             if(this.suiyamaResultGraph!= undefined){
                 const layer = this.suiyamaResultGraph.getNode(element.id)!.layer
                 for (const node of this.suiyamaResultGraph.layers[layer]) {
                    const el =  this.elements.find(e => e.id == node.id)
                    if(el != undefined && el instanceof MainElement){
                        dh.addDragHelper(new MainElementDragHelper(el))
                    }
                 }
 
             }
            this.dragHelper = dh

            this.dragHelper.startDrag(e)
            return
        }
        if(element instanceof ArrowCorner || element instanceof ArrowEndCorner){
            if(FLAG == this.DRAG_TWO_CORNERS){
                this.dragHelper = new MultiDragHelper()
                const multiHelper = this.dragHelper as MultiDragHelper
                const dH1 = new CornerDragHelper(element)
                dH1.addSnapElement(new SnapGrid(10, element.getPos()))
                multiHelper.addDragHelper(dH1)
                const dH2 = new CornerDragHelper(element.cornerAfter!)
                dH2.addSnapElement(new SnapGrid(10, element.cornerAfter!.getPos()))
                multiHelper.addDragHelper(
                    dH2)
                multiHelper.startDrag(e)
                return
            }
             const dh  = new CornerDragHelper(element)
             if(element.cornerBefore != undefined){
                dh.addSnapElement(new SnapX(element.cornerBefore.x))
                dh.addSnapElement(new SnapY(element.cornerBefore.y))
             }
             if(element.cornerAfter != undefined){
                dh.addSnapElement(new SnapX(element.cornerAfter.x))
                dh.addSnapElement(new SnapY(element.cornerAfter.y))
             }
             if(element instanceof ArrowEndCorner){
               //dh.addSnapElement(new SnapPoint(element.intersectingElement.getPos()))
               dh.addSnapElement(new SnapX(element.intersectingElement.x))
            dh.addSnapElement(new SnapY(element.intersectingElement.y))
             }
            this.dragHelper = dh
            this.svg.appendChild(dh.getSnapSvg())
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
    public svg = Utility.createSvgElement("svg")
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
        this.svg = d
        return d
    }

}
