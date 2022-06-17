import { BpmnEvent } from "./BpmnEvent";
import { Svg } from "../../Svg/Svg";

export class BpmnEventEnd extends BpmnEvent{
    override createSvg(){
        const c = Svg.relativeContainer(this.x,this.y)
        c.append(Svg.circleStroke(0,0,this.radius,9))
        c.appendChild(this.getTextSvg())
        return c
    }
}