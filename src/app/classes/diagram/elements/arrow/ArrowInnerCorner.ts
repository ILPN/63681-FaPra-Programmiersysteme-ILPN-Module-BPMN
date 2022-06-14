import { Utility } from 'src/app/classes/Utility';
import { Element } from '../../element';
import { MyDiagram } from '../../MyDiagram';
import { Arrow } from './Arrow';
import { ArrowCorner } from './ArrowCorner';
import { Vector } from './Vector';

export class ArrowInnerCorner extends ArrowCorner {

    constructor(id: string="", x: number, y: number, associatedArrrow:Arrow, diagram:MyDiagram) {
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
        if(this.draged) svg.classList.add("draged")
        
        //svg.setAttribute('style', 'overflow: visible;');
        const circle = this.createSvgElement('circle');
        circle.classList.add("arrowCornerCircle")
        circle.setAttribute('cx', `${this.x}`);
        circle.setAttribute('cy', `${this.y}`);
        svg.appendChild(circle);
        svg.appendChild(this.createDragAndAddSvgs())
        this.svgCircle = circle
        return svg;
    }
    private createDragAndAddSvgs():SVGElement{
        const radius = 3
        const distance = radius * 2 + 2
        const distance2 = radius * 4 + 2
        const c = this.createSvgElement("svg")
        c.classList.add("cornerFeatures")
        if(this._cornerBefore == undefined && this._cornerAfter == undefined) return c
        const hoverDummy = this.createSvgElement("circle")
            hoverDummy.setAttribute('r', `${distance2}`);
            hoverDummy.setAttribute('cx', `${this.x}`);
            hoverDummy.setAttribute('cy', `${this.y}`);
            hoverDummy.setAttribute("style","    fill:#ff000000")
            //c.appendChild(hoverDummy)
        if(this.cornerBefore != undefined){
            const beforeDrag = this.createSvgElement("circle")
            beforeDrag.classList.add("dragTwoCircle")
            const beforeDir = this.cornerBefore.posVector().minus(this.posVector()).toUnitVector()
            const beforeDragPos = this.posVector().plus(beforeDir.muliplied(distance))
            beforeDrag.setAttribute('cx', `${beforeDragPos.x}`);
            beforeDrag.setAttribute('cy', `${beforeDragPos.y}`);
            c.appendChild(beforeDrag)
            this.svgDragBefore = beforeDrag

            const beforePlus = this.createSvgElement("circle")
            beforePlus.classList.add("plusCircle")
            const plusPos = this.posVector().plus(beforeDir.muliplied(distance2))
            beforePlus.setAttribute('cx', `${plusPos.x}`);
            beforePlus.setAttribute('cy', `${plusPos.y}`);
            c.appendChild(beforePlus)
            this.svgPlusBefore = beforePlus
        }  
        if(this.cornerAfter != undefined){
            const afterDrag = this.createSvgElement("circle")
            afterDrag.classList.add("dragTwoCircle")
            const dir = this.cornerAfter.posVector().minus(this.posVector()).toUnitVector()
            const dragPos = this.posVector().plus(dir.muliplied(distance))
            afterDrag.setAttribute('cx', `${dragPos.x}`);
            afterDrag.setAttribute('cy', `${dragPos.y}`);
            c.appendChild(afterDrag)
            this.svgDragAfter = afterDrag


            const afterPlus = this.createSvgElement("circle")
            afterPlus.classList.add("plusCircle")
            const afterPos = this.posVector().plus(dir.muliplied(distance2))
            afterPlus.setAttribute('cx', `${afterPos.x}`);
            afterPlus.setAttribute('cy', `${afterPos.y}`);
            c.appendChild(afterPlus)
            this.svgPlusAfter = afterPlus
        } 

        if(this.cornerAfter != undefined && this.cornerBefore != undefined){
            const svgDelete = this.createSvgElement("circle")
            svgDelete.classList.add("deleteCircle")
            const dir1 = this.cornerAfter.posVector().minus(this.posVector()).toUnitVector()
            const dir2 = this.cornerBefore.posVector().minus(this.posVector()).toUnitVector()
            let dir = dir1.plus(dir2).muliplied(-1)
            if (dir.isAlmostZero()) {
                dir = dir1.rotate(Math.PI/2)
            }else{
                dir = dir.toUnitVector()
            }
            const pos = this.posVector().plus(dir.muliplied(distance))
            svgDelete.setAttribute('cx', `${pos.x}`);
            svgDelete.setAttribute('cy', `${pos.y}`);
            c.appendChild(svgDelete)
            this.svgDelete = svgDelete
        }
        return c
    }

    private svgCircle: SVGElement|undefined
    private svgDragBefore: SVGElement|undefined
    private svgDragAfter: SVGElement|undefined
    private svgPlusBefore: SVGElement|undefined
    private svgPlusAfter: SVGElement|undefined
    private svgDelete: SVGElement|undefined

    override addEventListenersToSvg(svg:SVGElement){

        if(this.svgCircle != undefined){
            this.svgCircle.onmousedown = e => this.diagram.onChildrenMouseDown(e,this)
        }
        if(this.svgDragBefore != undefined){
            this.svgDragBefore.onmousedown = e => this.diagram.onChildrenMouseDown(e,this.cornerBefore!, this.diagram.DRAG_TWO_CORNERS)
        }
        if(this.svgDragAfter != undefined){
            this.svgDragAfter.onmousedown = e => this.diagram.onChildrenMouseDown(e,this, this.diagram.DRAG_TWO_CORNERS)
        }

        if(this.svgDelete != undefined){
            //somehow onclick doesnt work after having draged the corner
            //this.svgDelete.onclick = e => this.arrow.removeCorner(this)
            //this.svgDelete.addEventListener("click", () => this.arrow.removeCorner(this));
            Utility.addSimulatedClickListener(this.svgDelete,(e) => this.arrow.removeCorner(this))
        }

        if(this.svgPlusBefore != undefined){
            Utility.addSimulatedClickListener(this.svgPlusBefore,(e) =>{
                this.arrow.addCornerBeforeCorner(this)
            })
        }
        if(this.svgPlusAfter != undefined){
            Utility.addSimulatedClickListener(this.svgPlusAfter,(e) =>{
                this.arrow.addCornerBeforeCorner(this.cornerAfter!)
            } )
        }

    }

}