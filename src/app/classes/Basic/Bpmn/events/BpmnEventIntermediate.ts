import { BpmnEvent } from "./BpmnEvent";
import { Svg } from "../../Svg/Svg";

export class BpmnEventIntermediate extends BpmnEvent{
    override svgCreation(){
        const c = Svg.relativeContainer(this.x,this.y)
        c.append(Svg.circleStroke(0,0,this.radius))
        c.append(Svg.circleStroke(0,0,this.radius- 5))
        c.appendChild(this.getTextSvg())
        return c
    }
}