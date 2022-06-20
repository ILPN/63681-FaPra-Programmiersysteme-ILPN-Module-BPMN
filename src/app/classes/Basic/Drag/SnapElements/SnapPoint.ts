import { Utility } from "src/app/classes/Utils/Utility";
import { Vector } from "src/app/classes/Utils/Vector";
import { Svg } from "../../Svg/Svg";
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
        return Svg.circleNoStyle(this.position,"snapPoint")
    }
    
}