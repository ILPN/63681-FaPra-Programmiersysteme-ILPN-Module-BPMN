import { Element } from "../element";
import { TaskType } from "./tasktype";

export class Task extends Element  {

    

    constructor(public label : string, public type : TaskType) {

       super();
    }

    

    public createSvg() : SVGElement {
        const circle = this.createSvgElement('circle');
        circle.setAttribute('cx', `${this.x}`);
        circle.setAttribute('cy', `${this.y}`);
        circle.setAttribute('r', '25');
       circle.setAttribute('fill', 'none');
       circle.setAttribute('stroke', 'black');

       this.registerSvg(circle);

       return circle;
   }

    

}
