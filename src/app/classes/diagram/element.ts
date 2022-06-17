import { Vector } from '../Utils/Vector';
import { DragDiagram } from './DragDiagram';
import { Position } from '../Basic/Position';
export abstract class Element implements Position {
    public  diagram: DragDiagram
    private _id: string;
    private _halfWidth: number = 0;
    private _halfHeight: number = 0;
    private domSVG: SVGElement | undefined;
    public draged = false
    constructor(id: string, diagram:DragDiagram) {
        this._id = id;
        this.diagram = diagram
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
