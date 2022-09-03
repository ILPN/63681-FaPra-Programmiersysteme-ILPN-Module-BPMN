import { Vector } from "src/app/classes/Utils/Vector";
import { Svg } from "../../Svg/Svg";
import { BpmnGateway } from "./BpmnGateway";

export class BpmnGatewayJoinAnd extends BpmnGateway{
    override svgCreation(){
        const c =  super.svgCreation()
        const logoDimen = new Vector(this.width*0.5,this.width*0.5)
        c.appendChild(Svg.image("assets/And.svg",logoDimen.half().invers(),logoDimen.x))
         return c
     }
}