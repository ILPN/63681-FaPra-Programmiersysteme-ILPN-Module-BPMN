import { BpmnNode } from "../BpmnNode";
import { Svg } from "../../Svg/Svg";

export class BpmnEvent extends BpmnNode{
    override svgCreation(){
        return Svg.event(this.getPos(), this.radius,this.label)
    }

}