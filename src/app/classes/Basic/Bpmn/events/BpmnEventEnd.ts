import { BpmnEvent } from "./BpmnEvent";
import { Svg } from "../../Svg/Svg";

export class BpmnEventEnd extends BpmnEvent{
    override svgCreation(){
        const c = super.svgCreation()
        c.appendChild(Svg.circleStroke(0,0,this.radius, 10))
        return c
    }
}