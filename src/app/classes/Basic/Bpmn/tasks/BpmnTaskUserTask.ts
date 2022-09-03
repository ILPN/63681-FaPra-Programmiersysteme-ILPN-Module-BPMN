import { Svg } from "../../Svg/Svg"
import { BpmnTask } from "./BpmnTask"

export class BpmnTaskUserTask extends BpmnTask{
    override getIconUrl(){
        return "assets/usertask.svg"
    }

}