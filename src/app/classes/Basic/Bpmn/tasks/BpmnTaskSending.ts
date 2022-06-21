import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskSending extends BpmnTask{
    override svgCreation(){
        const c = super.svgCreation()
        c.appendChild(Svg.image("/ilovepetrinets/template/assets/manual.svg",this.logoX,this.logoY, 20))
        return c
    }

}