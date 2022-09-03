import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskSending extends BpmnTask{
    override getIconUrl(){
        return "assets/sending.svg"
    }

}