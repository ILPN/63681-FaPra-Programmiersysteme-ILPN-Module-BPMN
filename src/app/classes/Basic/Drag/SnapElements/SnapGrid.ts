import { Utility } from "src/app/classes/Utils/Utility";
import { Vector } from "src/app/classes/Utils/Vector";
import { SnapElement } from "./SnapElement";

export class SnapGrid extends SnapElement{
    constructor(gridWidth:number, shiftGrid:Vector = new Vector(0,0)){
        super();
        this.grid = gridWidth
        this.shiftGrid = new Vector(shiftGrid.x % gridWidth, shiftGrid.y % gridWidth)
        //console.log(this.shiftGrid)
    }
    private grid = 0;
    private shiftGrid = new Vector(0,0)
    protected shouldBeSnaped(toBeSnaped: Vector): boolean {
        return true
    }
    protected snapTo(toBeSnaped: Vector): Vector {
        toBeSnaped = toBeSnaped.minus(this.shiftGrid)
        const newX =Math.round(toBeSnaped.x/this.grid)*this.grid
        const newY = Math.round(toBeSnaped.y/this.grid)*this.grid
            const newPos = (new Vector(newX, newY)).plus(this.shiftGrid)
           return newPos
    }
    createSVG(): SVGElement {
        let empty = Utility.createSvgElement('svg');
        return empty
    }
}

