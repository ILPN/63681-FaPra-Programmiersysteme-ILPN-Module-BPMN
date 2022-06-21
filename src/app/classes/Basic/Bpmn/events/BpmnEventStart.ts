import { BpmnEvent } from "./BpmnEvent";
import { Svg } from "../../Svg/Svg";

export class BpmnEventStart extends BpmnEvent{
    override svgCreation(){
        const c = Svg.relativeContainer(this.x,this.y)
        c.append(Svg.circleStroke(0,0,this.radius,2))
        c.appendChild(this.getTextSvg())
        return c
    }
}