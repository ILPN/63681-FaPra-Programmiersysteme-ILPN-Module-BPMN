import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskManual extends BpmnTask{
    override svgCreation(){
        const c = super.svgCreation()
        c.appendChild(Svg.image("/ilovepetrinets/template/assets/manual.svg",this.logoX, this.logoY))
        return c
    }

}