import { Utility } from 'src/app/classes/Utils/Utility';
import { DragDiagram } from '../../DragDiagram';
import { Arrow } from './Arrow';
import { ArrowCorner } from './ArrowCorner';

export class ArrowInnerCorner extends ArrowCorner {
    constructor(
        id: string = '',
        x: number,
        y: number,
        associatedArrrow: Arrow,
        diagram: DragDiagram
    ) {
        super(id, x, y, associatedArrrow, diagram);
        this._arrow = associatedArrrow;
    }

    public override createSvg(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        if (this.draged) svg.classList.add('draged');
        const circle = this.createSvgElement('circle');
        circle.classList.add('arrowCornerCircle');
        circle.setAttribute('cx', `${this.getPos().x}`);
        circle.setAttribute('cy', `${this.getPos().y}`);
        this.addStandardListeners(circle);
        svg.appendChild(circle);
        svg.appendChild(this.createDeleteCircle());
        return svg;
    }
    private createDeleteCircle() {
        const distance = 10;
        const svgDelete = this.createSvgElement('svg');
        svgDelete.classList.add('deleteSvg');
        if (this.cornerAfter == undefined || this.cornerBefore == undefined)
            return svgDelete;

        
        const deleteCircle = this.createSvgElement('circle');
        deleteCircle.classList.add('deleteCircle');
        const dir1 = this.cornerAfter
            .getPos()
            .minus(this.getPos())
            .toUnitVector();
        const dir2 = this.cornerBefore
            .getPos()
            .minus(this.getPos())
            .toUnitVector();
        let dir = dir1.plus(dir2).muliplied(-1);
        if (dir.isAlmostZero()) {
            const nDir1 = dir1.rotate(Math.PI / 2);
            const nDir2 = dir2.rotate(Math.PI / 2);
            dir = nDir1.y< nDir2.y? nDir1:nDir2 //to avoid delete Circle beeing hidden behind mouse pointer
        } else {
            dir = dir.toUnitVector();
        }
        const pos = this.getPos().plus(dir.muliplied(distance));
        deleteCircle.setAttribute('cx', `${pos.x}`);
        deleteCircle.setAttribute('cy', `${pos.y}`);

        //somehow onclick doesnt work after having draged the corner
        //this.svgDelete.onclick = e => this.arrow.removeCorner(this)
        //this.svgDelete.addEventListener("click", () => this.arrow.removeCorner(this));
        Utility.addSimulatedClickListener(deleteCircle, (e) =>
            this.arrow.removeCorner(this)
        );
        
        const hoverDummy = this.createSvgElement('circle');
        hoverDummy.setAttribute('cx', `${pos.x}`);
        hoverDummy.setAttribute('cy', `${pos.y}`);
        hoverDummy.setAttribute("style", " r:7px;fill:#32323200")
        svgDelete.appendChild(hoverDummy)
        svgDelete.appendChild(deleteCircle)
        return svgDelete
    }
}
