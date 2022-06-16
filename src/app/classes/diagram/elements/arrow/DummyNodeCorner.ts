import { ArrowCorner } from "./ArrowCorner";

export class DummyNodeCorner extends ArrowCorner{
    override createSvg(){
        const container = this.createSvgElement('svg')
        container.setAttribute('id', `${this.id}`);
        const circle = this.createSvgElement('circle');
        circle.classList.add("dummyNodeCircle")
        circle.setAttribute('cx', `${this.x}`);
        circle.setAttribute('cy', `${this.y}`);
        container.appendChild(circle);
        this.addStandardListeners(container)
        return container
    }
}