import { Element } from '../../element';
import { MyDiagram } from '../../MyDiagram';
import { Arrow } from './Arrow';
import { ArrowCorner } from './ArrowCorner';
import { Vector } from './Vector';

export class ArrowEndCorner extends ArrowCorner {
    constructor(
        id: string,
        x: number,
        y: number,
        associatedArrrow: Arrow,
        diagram: MyDiagram
    ) {
        super(id, x, y, associatedArrrow, diagram);
        this.x = x;
        this.y = y;
    }

    private _intersectionPos = new Vector();
    public get intersectionPos() {
        return this._intersectionPos;
    }
    public set intersectionPos(value) {
        this._intersectionPos = value;
    }

    public override createSvg(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.classList.add('arrowEndCornerSvg');
        if (this.draged) svg.classList.add('draged');
        svg.setAttribute('style', 'overflow: visible;');

        const intersectionCircle = this.createSvgElement('circle');
        intersectionCircle.setAttribute('cx', `${this.intersectionPos.x}`);
        intersectionCircle.setAttribute('cy', `${this.intersectionPos.y}`);
        intersectionCircle.classList.add('arrowIntersection');
        svg.appendChild(intersectionCircle);
        this.svgIntersection = intersectionCircle;

        if (this.posVector().distanceTo(this.intersectionPos) >= 0.01) {
            let path = this.createSvgElement('path');
            path.classList.add('arrowLineInElement');
            let pathString = `M ${this.x},${this.y} ${this.intersectionPos.x},${this.intersectionPos.y}`;
            path.setAttribute('d', pathString);
            svg.appendChild(path);
            const circle = this.createSvgElement('circle');
            circle.classList.add('arrowEndCircle');
            circle.setAttribute('r', `2`);
            circle.setAttribute('cx', `${this.x}`);
            circle.setAttribute('cy', `${this.y}`);
            svg.appendChild(circle);
        }

        return svg;
    }
    private svgIntersection: SVGElement | undefined;
    override addEventListenersToSvg(svg: SVGElement) {
        if (this.svgIntersection != undefined) {
            this.svgIntersection.onmousedown = (event) => {
                console.log('clicked the boy');
                this.onMouseDown(event);
            };
        }
        svg.onmouseup = (event) => {
            this.onMousUp(event);
        };
        svg.onmousemove = (event) => {
            this.onMousMove(event);
        };
    }
}
