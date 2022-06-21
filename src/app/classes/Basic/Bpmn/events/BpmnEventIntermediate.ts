import { BpmnEvent } from "./BpmnEvent";
import { Svg } from "../../Svg/Svg";

export class BpmnEventIntermediate extends BpmnEvent{
    override svgCreation(){
        const c = super.svgCreation()
        c.appendChild(Svg.circleStroke(0,0,this.radius, 3))
        c.appendChild(Svg.circleStroke(0,0,this.radius-5, 3))
        return c
    }
}