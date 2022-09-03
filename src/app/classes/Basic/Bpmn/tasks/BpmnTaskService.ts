import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskService extends BpmnTask{
    override getIconUrl(){
        return "assets/service.svg"
    }
}