import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskReceiving extends BpmnTask{
    override createSvg(){
        const c = super.createSvg()
        c.appendChild(Svg.logoReceiving(this.logoX,this.logoY, 20))
        return c
    }

}