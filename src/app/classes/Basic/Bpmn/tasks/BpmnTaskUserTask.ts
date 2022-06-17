import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskUserTask extends BpmnTask{
    override createSvg(){
        const c = super.createSvg()
        c.appendChild(Svg.image("/ilovepetrinets/template/assets/usertask.svg",this.logoX, this.logoY))
        return c
    }

}