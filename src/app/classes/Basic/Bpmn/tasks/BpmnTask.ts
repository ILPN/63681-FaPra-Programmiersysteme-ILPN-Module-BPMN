import { BpmnNode } from "../BpmnNode";
import { Svg } from "../../Svg/Svg";
import { Version } from "@angular/compiler";
import { Vector } from "src/app/classes/Utils/Vector";

export class BpmnTask extends BpmnNode{

    readonly dimensions = new Vector(150,90)
    readonly width:number = 150//170 
    readonly heigth:number = 90// 100 
    protected readonly logoX = -this.width/2 + 10
    protected readonly logoY =  -this.heigth/2 + 10

    override svgCreation(){
        return Svg.task(this.getPos(),this.dimensions,this.label,this.getIconUrl())
    }
    protected getIconUrl(){
        return ""
    }

}

//Sending, Manual, Service, BusinessRule, Receiving, UserTask