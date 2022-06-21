import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskReceiving extends BpmnTask{
    override svgCreation(){
        const c = super.svgCreation()
        c.appendChild(Svg.image("/ilovepetrinets/template/assets/rule.svg",this.logoX,this.logoY, 20))
        return c
    }

}