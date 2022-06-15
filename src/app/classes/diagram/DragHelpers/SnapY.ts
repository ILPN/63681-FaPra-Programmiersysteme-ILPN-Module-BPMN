import { Utility } from "../../Utility";
import { Vector } from "../elements/arrow/Vector";
import { SnapElement } from "./SnapElement";

export class SnapY extends SnapElement{
    constructor(y:number){
        super();
        this._y = y
    }
    private _y = 0; 
    public get y() {
        return this._y;
    }
    public set y(value) {
        this._y = value;
    }
    protected shouldBeSnaped(toBeSnaped: Vector): boolean {
        return Math.abs(toBeSnaped.y- this.y) < 10
    }
    protected snapTo(toBeSnaped: Vector): Vector {
           return new Vector(toBeSnaped.x, this._y)
    }
    createSVG(): SVGElement {
        let pathSvg = Utility.createSvgElement('path');
        pathSvg.classList.add("snapLine")
        pathSvg.setAttribute('d', `M 0,${this._y} 10000,${this._y}  `);
        return pathSvg
    }
}

