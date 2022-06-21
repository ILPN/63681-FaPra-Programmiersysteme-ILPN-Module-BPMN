import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskManual extends BpmnTask{
    override getIconUrl(){
        return "/ilovepetrinets/template/assets/manual.svg"
    }

}