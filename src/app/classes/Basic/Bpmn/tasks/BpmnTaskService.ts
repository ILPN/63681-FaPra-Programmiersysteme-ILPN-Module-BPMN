import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskService extends BpmnTask{
    override svgCreation(){
        const c = super.svgCreation()
        c.appendChild(Svg.image("/ilovepetrinets/template/assets/service.svg",this.logoX, this.logoY))
        return c
    }

}