import { Utility } from "../Utils/Utility"
import { Element } from "./element"
import { ArrowCorner } from "./elements/arrow/ArrowCorner"
import { MainElement } from "./elements/MainElement"
import { ArrowEndCorner } from "./elements/arrow/ArrowEndCorner"
import { LayeredGraph } from "../Sugiyama/LayeredGraph"
import { DragHelperInterface } from "./Drag/DragHelpers/DragHelperInterface"
import { MainElementDragHelper } from "./Drag/DragHelpers/MainElementDragHelper"
import { MultiDragHelper } from "./Drag/DragHelpers/MultiDragHelper"
import { CornerDragHelper } from "./Drag/DragHelpers/CornerDragHelper"
import { SnapGrid } from "./Drag/SnapElements/SnapGrid"
import { SnapX } from "./Drag/SnapElements/SnapX"
import { SnapY } from "./Drag/SnapElements/SnapY"
import { OrderDragHelper2 } from "./Drag/DragHelpers/OrderDragHelper"
import { DummyNodeCorner } from "./elements/arrow/DummyNodeCorner"
import { DragHelper } from "./Drag/DragHelpers/DragHelper"

export class MyDiagram{

    private suiyamaResultGraph:LayeredGraph|undefined
    setSugiyamaResult(result:LayeredGraph){
        this.suiyamaResultGraph = result
    }

    removeAndRender(corner: ArrowCorner) {
        corner.updateSvg().remove()
        this.elements = this.elements.filter(e => e != corner)
    }

    readonly DRAG_THIS_CORNER_AND_ITS_AFTER_CORNER = 2

    private dragHelper: DragHelperInterface<Element> | undefined
    onChildrenMouseDown(e: MouseEvent, element: Element, FLAG:number = 0) {
        if(element instanceof MainElement || element instanceof DummyNodeCorner){

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

             let dhOfElement:DragHelper<Element>
             if(element instanceof  MainElement){
                dhOfElement = new MainElementDragHelper(element)
             }else{
                dhOfElement = new CornerDragHelper(element)
             }

             
             const dh= new OrderDragHelper2(dhOfElement)
             if(this.suiyamaResultGraph!= undefined){
                 const layer = this.suiyamaResultGraph.getNode(element.id)!.layer
                 for (const node of this.suiyamaResultGraph.layers[layer]) {
                    const el =  this.elements.find(e => e.id == node.id)
                    if(el != undefined ){
                        if(el instanceof  MainElement)
                        dh.addDragHelper(new MainElementDragHelper(el))
                        else if(el instanceof DummyNodeCorner){
                            dh.addDragHelper(new CornerDragHelper(el))
                        }
                    }
                 }
 
             }
            this.dragHelper = dh

            this.dragHelper.startDrag(e)
            return
        }
        if(element instanceof ArrowCorner || element instanceof ArrowEndCorner){
            if(FLAG == this.DRAG_THIS_CORNER_AND_ITS_AFTER_CORNER){
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
