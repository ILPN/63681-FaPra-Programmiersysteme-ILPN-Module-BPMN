import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskBusinessRule extends BpmnTask{
    override getIconUrl(){
        return "assets/rule.svg"
    }

}