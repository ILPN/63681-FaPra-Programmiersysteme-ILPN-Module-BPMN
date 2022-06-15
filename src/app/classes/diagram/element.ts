import { ForwardRefHandling, typeWithParameters } from '@angular/compiler/src/render3/util';
import { Vector } from './elements/arrow/Vector';
import { MyDiagram } from './MyDiagram';
import { Position } from './Position';

export abstract class Element implements Position {
    public  diagram: MyDiagram
    private _id: string;
    private _halfWidth: number = 0;
    private _halfHeight: number = 0;
    private domSVG: SVGElement | undefined;
    public draged = false
    protected _childrenElements: Element[] = [];
    public get childrenElements(): Element[] {
        return this._childrenElements;
    }

    addChildrenElement(child:Element){
        if(this.childrenElements.find(e => e == child))return
        this._childrenElements.push(child)
    }

    /*
    private domSvgRoot: SVGElement | undefined;
    public getSvgRoot(){
        if(this.domSvgRoot == undefined){
            const root = document.getElementById("rootsvg")
            this.domSvgRoot = document.getElementById("rootsvg") as SVGElement
        }
    }*/
    constructor(id: string, diagram:MyDiagram) {
        this._id = id;
        this.diagram = diagram
        this.placHolderSvg = this.createSvgElement('svg');
    }
    setPosXY(x: number, y: number): void {
        this.x = x
        this.y = y
    }
    getPos(): Vector {
        return new Vector(this.x,this.y)
    }
    setPos(pos: Vector): void {
        this.x = pos.x
        this.y = pos.y
    }
    private _x: number =0;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    private _y: number = 0;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }

    get distanceX(): number {
        return this._halfWidth;
    }

    set distanceX(value: number) {
        this._halfWidth = value;
    }

    get distanceY(): number {
        return this._halfHeight;
    }

    set distanceY(value: number) {
        this._halfHeight = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    public abstract createSvg(): SVGElement;

    createSvgElement(name: string): SVGElement {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }


    public updateSvg():SVGElement {
        const newSvg = this.createSvg();
        if (this.domSVG != undefined && this.domSVG.isConnected ) {
            this.domSVG!.replaceWith(newSvg);
            this.domSVG = newSvg;
            return this.domSVG
        }
        this.domSVG = newSvg;
        return this.domSVG
    }

    placHolderSvg: SVGElement;


    private moveSVGToLastPositionInDOM() {
        // move svgelement in dom to last position so it stays visible over other svgelements
        if (this.domSVG == undefined) return;
        const parentNode: ParentNode | null | undefined =
            this.domSVG.parentNode;
        const root = document.getElementById('rootsvg');
        //console.log(parentNode)
        parentNode?.replaceChild(this.placHolderSvg, this.domSVG);
        root?.append(this.domSVG);
    }
    private moveSVGBackToOriginalPositionInDOM() {
        if (this.domSVG == undefined) return;
        this.domSVG.remove;
        this.placHolderSvg.replaceWith(this.domSVG);
    }

    protected addStandardListeners(svg: SVGElement){
        svg.onmousedown = (event) => {
            this.diagram.onChildrenMouseDown(event,this);
        };
        svg.onmouseup = (event) => {
            this.diagram.onChildrenMouseUp(event, this);
        };
        svg.onmousemove = (event) => {
            this.diagram.onChildrenMouseMove(event,this);
        };
    }
}
