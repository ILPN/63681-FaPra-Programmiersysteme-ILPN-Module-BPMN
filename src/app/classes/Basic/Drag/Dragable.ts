import { Vector } from "../../Utils/Vector";
import { DragWrapperGraph } from "./DragWrapperGraph";

export interface Dragable{
    setPos(value: Vector):void ;
    updateSvg():SVGElement;
    getPos():Vector
    addDragablenessToSvg(svg:SVGElement):void
    get draggableGraph():DragWrapperGraph

    get dragged():boolean
    set dragged(value:boolean)
}