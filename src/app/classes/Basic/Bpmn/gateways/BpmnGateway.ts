import { BpmnNode } from "../BpmnNode";
import { Svg } from "../../Svg/Svg";

export class BpmnGateway extends BpmnNode{

    readonly width:number = 70

    override svgCreation(){
        return Svg.gateway(this.getPos(),this.width,this.label)
    }

}