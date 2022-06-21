import { Svg } from "../../Svg/Svg";
import { BpmnEvent } from "./BpmnEvent";

export class BpmnEventStart extends BpmnEvent{
    override svgCreation(){
        const c = super.svgCreation()
        c.appendChild(Svg.circleStroke(0,0,this.radius, 3))
        return c
    }
}