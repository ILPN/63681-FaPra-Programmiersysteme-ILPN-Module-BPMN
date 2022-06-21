import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskService extends BpmnTask{
    override getIconUrl(){
        return "/ilovepetrinets/template/assets/service.svg"
    }
}