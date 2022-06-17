import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskUserTask extends BpmnTask{
    override createSvg(){
        const c = super.createSvg()
        c.appendChild(Svg.logoUserTask(this.logoX, this.logoY))
        return c
    }

}