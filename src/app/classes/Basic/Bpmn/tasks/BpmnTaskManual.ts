import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskManual extends BpmnTask{
    override createSvg(){
        const c = super.createSvg()
        c.appendChild(Svg.logoManual())
        return c
    }

}