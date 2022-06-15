import { Utility } from "../../Utility";
import { Vector } from "../elements/arrow/Vector";
import { SnapElement } from "./SnapElement";

export class SnapPoint extends SnapElement{
    position = new Vector()
    private radius = 10
    constructor(pos:Vector){
        super();
        this.position = pos
    }
    protected shouldBeSnaped(toBeSnaped: Vector): boolean {
         return toBeSnaped.distanceTo(this.position) < this.radius
    }
    protected snapTo(toBeSnaped: Vector): Vector {
        return this.position
    }
    createSVG(): SVGElement {
        const svg = Utility.createSvgElement("circle")
        svg.setAttribute("cx",`${this.position.x}`)
        svg.setAttribute("cy",`${this.position.y}`)
        svg.setAttribute("r", ""+this.radius)
        svg.classList.add("snapPoint")
        return svg
    }
    
}