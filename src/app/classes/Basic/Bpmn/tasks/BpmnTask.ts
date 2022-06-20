import { BpmnNode } from "../BpmnNode";
import { Svg } from "../../Svg/Svg";

export class BpmnTask extends BpmnNode{

    readonly width:number = 150//170 
    readonly heigth:number = 90// 100 
    protected readonly logoX = -this.width/2 + 10
    protected readonly logoY =  -this.heigth/2 + 10

    override createSvg(){
        const c = Svg.relativeContainer(this.x,this.y)
        c.append(Svg.rectRounded(0,0,this.width,this.heigth,10,2))
        c.appendChild(Svg.text(this.label, 0, 0,))
        return c
    }

}

//Sending, Manual, Service, BusinessRule, Receiving, UserTask