import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskSending extends BpmnTask{
    override createSvg(){
        const c = super.createSvg()
        c.appendChild(Svg.logoSending(this.logoX(),this.logoY(), 20))
        return c
    }

}