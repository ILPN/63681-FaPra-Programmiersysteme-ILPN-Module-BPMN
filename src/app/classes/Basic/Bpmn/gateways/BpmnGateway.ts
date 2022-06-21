import { BpmnNode } from "../BpmnNode";
import { Svg } from "../../Svg/Svg";

export class BpmnGateway extends BpmnNode{

    readonly width:number = 70

    override svgCreation(){
        /*
        const c = Svg.relativeContainer(this.x,this.y)
        c.append(Svg.rotatetSquare(0,0,this.width))
        c.appendChild(Svg.text(this.label, 0, this.textY))
        */
        return Svg.gateway(this.getPos(),this.width,this.label)
    }

}