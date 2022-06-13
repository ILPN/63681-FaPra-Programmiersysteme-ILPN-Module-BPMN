import { Element } from '../../element';
import { MyDiagram } from '../../MyDiagram';
import { Arrow } from './Arrow';
import { Vector } from './Vector';

export class ArrowCorner extends Element {
    protected _arrow: Arrow;
    public get arrow(): Arrow {
        return this._arrow;
    }

    protected _cornerBefore: ArrowCorner | undefined;
    public get cornerBefore(): ArrowCorner | undefined {
        return this._cornerBefore;
    }
    public set cornerBefore(value: ArrowCorner | undefined) {
        this._cornerBefore = value;
    }
    protected _cornerAfter: ArrowCorner | undefined;
     get cornerAfter(): ArrowCorner | undefined {
        return this._cornerAfter;
    }
     set cornerAfter(value: ArrowCorner | undefined) {
        this._cornerAfter = value;
    }

    posVector(): Vector {
        return new Vector(this.x, this.y);
    }
    protected _raduis: number = 5;

    constructor(id: string, x: number, y: number, associatedArrrow:Arrow, diagram:MyDiagram) {
        super(id, diagram);
        this.x = x;
        this.y = y;
        this._arrow = associatedArrrow
    }


    public createSvg(): SVGElement {
        const svg = this.createSvgElement('svg')
        svg.setAttribute('id', `${this.id}`);
        //svg.setAttribute('x', `${this.x}`);
        //svg.setAttribute('y', `${this.y}`);
        svg.setAttribute('style', 'overflow: visible;');
        const circle = this.createSvgElement('circle');
        circle.classList.add("arrowCornerCircle")
        circle.setAttribute('r', `${this._raduis}`);
        circle.setAttribute('cx', `${this.x}`);
        circle.setAttribute('cy', `${this.y}`);
        svg.appendChild(circle);
        return svg;
    }
}