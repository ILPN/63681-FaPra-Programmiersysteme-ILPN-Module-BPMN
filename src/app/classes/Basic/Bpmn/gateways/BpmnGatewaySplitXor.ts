import { Vector } from "src/app/classes/Utils/Vector";
import { Svg } from "../../Svg/Svg";
import { BpmnGateway } from "./BpmnGateway";

export class BpmnGatewaySplitXor extends BpmnGateway{
    override svgCreation(){
        const c =  super.svgCreation()
        const logoDimen = new Vector(this.width*0.5,this.width*0.5)
        c.appendChild(Svg.image("/ilovepetrinets/template/assets/xor.svg",logoDimen.half().invers(),logoDimen.x))
         return c
     }
}