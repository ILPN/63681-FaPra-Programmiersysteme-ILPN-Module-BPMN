import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskReceiving extends BpmnTask{
    override getIconUrl(){
        return "/ilovepetrinets/template/assets/rule.svg"
    }

}