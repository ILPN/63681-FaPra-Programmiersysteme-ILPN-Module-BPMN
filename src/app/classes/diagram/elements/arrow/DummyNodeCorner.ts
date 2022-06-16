import { ArrowCorner } from "./ArrowCorner";

export class DummyNodeCorner extends ArrowCorner{
    override createSvg(){
        const container = this.createSvgElement('svg')
        container.setAttribute('id', `${this.id}`);
        //container.setAttribute('style', 'overflow: visible;');
        const circle = this.createSvgElement('circle');
        circle.classList.add("dummyNodeCircle")
        // circle.setAttribute('r', `${this._radius}`); defined in scss
        circle.setAttribute('cx', `${this.x}`);
        circle.setAttribute('cy', `${this.y}`);
        container.appendChild(circle);
        this.addStandardListeners(container)
        return container
    }
}