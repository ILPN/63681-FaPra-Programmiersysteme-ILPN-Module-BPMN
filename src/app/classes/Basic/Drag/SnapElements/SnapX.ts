import { Utility } from "src/app/classes/Utils/Utility";
import { Vector } from "src/app/classes/Utils/Vector";
import { SnapElement } from "./SnapElement";

export class SnapX extends SnapElement{
    constructor(x:number){
        super();
        this._x = x
    }
    private _x = 0;
    protected shouldBeSnaped(toBeSnaped: Vector): boolean {
        return Math.abs(toBeSnaped.x- this._x) < 10
    }
    protected snapTo(toBeSnaped: Vector): Vector {
           return new Vector(this._x, toBeSnaped.y)
    }
    createSVG(): SVGElement {
        let pathSvg = Utility.createSvgElement('path');
        pathSvg.classList.add("snapLine")
        pathSvg.setAttribute('d', `M ${this._x},${-10000} ${this._x},${10000}`);

        return pathSvg
    }
}

