import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskService extends BpmnTask{
    override createSvg(){
        const c = super.createSvg()
        c.appendChild(Svg.image("/ilovepetrinets/template/assets/service.svg",this.logoX, this.logoY))
        return c
    }

}