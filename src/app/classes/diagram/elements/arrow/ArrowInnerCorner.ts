import { Element } from '../../element';
import { MyDiagram } from '../../MyDiagram';
import { Arrow } from './Arrow';
import { ArrowCorner } from './ArrowCorner';
import { Vector } from './Vector';

export class ArrowInnerCorner extends ArrowCorner {

    constructor(id: string, x: number, y: number, associatedArrrow:Arrow, diagram:MyDiagram) {
        super(id,x,y,associatedArrrow, diagram);
        this.x = x;
        this.y = y;
        this._arrow = associatedArrrow
    }


    public override createSvg(): SVGElement {
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
        svg.appendChild(this.createDragAndAddSvgs())
        this.svgCircle = circle

        svg.appendChild(circle);
        return svg;
    }
    private createDragAndAddSvgs():SVGElement{
        const radius = 3
        const c = this.createSvgElement("g")
        if(this._cornerBefore == undefined && this._cornerAfter == undefined) return c
        //in beforeCorner direction
        if(this.cornerBefore != undefined){
            const beforeDrag = this.createSvgElement("circle")
            beforeDrag.classList.add("dragTwoCircle")
            beforeDrag.setAttribute('r', `${radius}`);
            const beforeDir = this.cornerBefore.posVector().minus(this.posVector()).toUnitVector()
            const beforeDragPos = this.posVector().plus(beforeDir.muliplied(this._raduis*3))
            beforeDrag.setAttribute('cx', `${beforeDragPos.x}`);
            beforeDrag.setAttribute('cy', `${beforeDragPos.y}`);
            c.appendChild(beforeDrag)
            this.svgDragBefore = beforeDrag
        }  
        if(this.cornerAfter != undefined){
            const afterDrag = this.createSvgElement("circle")
            afterDrag.classList.add("dragTwoCircle")
            afterDrag.setAttribute('r', `${radius}`);
            const dir = this.cornerAfter.posVector().minus(this.posVector()).toUnitVector()
            const dragPos = this.posVector().plus(dir.muliplied(this._raduis*3))
            afterDrag.setAttribute('cx', `${dragPos.x}`);
            afterDrag.setAttribute('cy', `${dragPos.y}`);
            c.appendChild(afterDrag)
            this.svgDragAfter = afterDrag
        } 
        return c
    }

    private svgCircle: SVGElement|undefined
    private svgDragBefore: SVGElement|undefined
    private svgDragAfter: SVGElement|undefined

    override addEventListenersToSvg(svg:SVGElement){

        if(this.svgCircle != undefined){
            this.svgCircle.onmousedown = e => this.diagram.onChildrenMouseDown(e,this)
        }
        if(this.svgDragBefore != undefined){
            this.svgDragBefore.onmousedown = e => this.diagram.onChildrenMouseDown(e,this, this.diagram.DRAG_BEFORE_FLAG)
        }
        if(this.svgDragAfter != undefined){
            this.svgDragAfter.onmousedown = e => this.diagram.onChildrenMouseDown(e,this, this.diagram.DRAG_AFTER_FLAG)
        }
    }

}