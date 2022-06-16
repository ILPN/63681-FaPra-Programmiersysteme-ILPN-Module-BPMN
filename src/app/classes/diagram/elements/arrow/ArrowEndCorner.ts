import { Vector } from 'src/app/classes/Utils/Vector';
import { DragDiagram } from '../../DragDiagram';
import { Element } from '../../element';
import { Arrow } from './Arrow';
import { ArrowCorner } from './ArrowCorner';

export class ArrowEndCorner extends ArrowCorner {
    
    constructor(
        id: string,
        x:number,y:number,
        associatedArrrow: Arrow,
        public intersectingElement:Element,
        diagram: DragDiagram
    ) {
        super(id, x,y, associatedArrrow, diagram);
    }

    /**
     * position where arrow intersects with edge of  this.intersectingElement
     */
    private _intersectionPos = new Vector();
    public get intersectionPos() {
        return this._intersectionPos;
    }
    public set intersectionPos(value) {
        if(value != undefined)
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

        if (this.getPos().distanceTo(this.intersectionPos) >= 0.01) {
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

        intersectionCircle.onmousedown = (event) => {
            this.diagram.onChildrenMouseDown(event,this);
        };
        
        svg.onmouseup = (event) => {
            this.diagram.onChildrenMouseUp(event, this);
        };
        svg.onmousemove = (event) => {
            this.diagram.onChildrenMouseMove(event,this);
        };

        return svg;
    }
}
