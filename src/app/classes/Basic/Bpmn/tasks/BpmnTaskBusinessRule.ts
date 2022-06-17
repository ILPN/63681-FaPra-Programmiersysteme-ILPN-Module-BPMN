import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskBusinessRule extends BpmnTask{
    override createSvg(){
        const c = super.createSvg()
        c.appendChild(Svg.logoBusinessRule(this.logoX, this.logoY))
        return c
    }

}