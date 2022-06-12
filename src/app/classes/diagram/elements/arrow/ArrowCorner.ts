import { Element } from '../../element';
import { MyDiagram } from '../../MyDiagram';
import { Arrow } from './Arrow';
import { Vector } from './Vector';

export class ArrowCorner extends Element {
    private arrow:Arrow
    private _visible = true;
    public get visible() {
        return this._visible;
    }
    public set visible(value) {
        this._visible = value;
    }
    onDragTo(ax: number, ay: number) {
        this.x =ax;
        this.y =ay;
        this.updateSvg()
        this.arrow.updateSvg()
    }
    posVector(): Vector {
        return new Vector(this.x, this.y);
    }
    private _raduis: number = 10;

    constructor(id: string, x: number, y: number, associatedArrrow:Arrow, diagram:MyDiagram) {
        super(id, diagram);
        this.x = x;
        this.y = y;
        this.arrow = associatedArrrow
    }


    public createSvg(): SVGElement {
        const svg = this.createSvgElement('svg')
        if(!this.visible){
            return svg
            //svg.setAttribute("visibility","hidden")
        } 
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', `${this.x}`);
        svg.setAttribute('y', `${this.y}`);
        svg.setAttribute('style', 'overflow: visible;');
        

        const circle = this.createSvgElement('circle');
        circle.setAttribute('r', `${this._raduis}`);
        circle.setAttribute('style', 'fill:#00b8ff;stroke:none;stroke-width:3.77953;fill-opacity:0.28961748');
        svg.appendChild(circle);
        return svg;
    }
}