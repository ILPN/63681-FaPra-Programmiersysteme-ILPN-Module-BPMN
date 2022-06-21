import { BpmnNode } from "../BpmnNode";
import { Svg } from "../../Svg/Svg";

export class BpmnEvent extends BpmnNode{
    readonly textY =  this.radius+15
    override svgCreation(){
        const c = Svg.relativeContainer(this.x,this.y)
        c.append(Svg.circleStroke(0,0,this.radius))
        c.appendChild(this.getTextSvg())
        return c
    }
    protected getTextSvg(): SVGElement {
        const text = Svg.text(this.label, 0, this.textY,12)
        return text;
    }

}