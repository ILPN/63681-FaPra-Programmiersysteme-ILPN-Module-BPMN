import { Element } from './../element'

export class ConnectorElement extends Element  {
    private _raduis : number = 25;


    constructor(id: string) {
        super(id);
    }

    public createSvg(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', `${this.x}`);
        svg.setAttribute('y', `${this.y}`);
        svg.setAttribute('style', "overflow: visible;");

        const circle = this.createSvgElement('circle');
        circle.setAttribute('r', `${this._raduis}`);
        circle.setAttribute('fill', 'white');
        svg.appendChild(circle);
        this.addSVGtoColorChange(circle);
        this.registerSvg(svg);
        return svg;
    }


}
