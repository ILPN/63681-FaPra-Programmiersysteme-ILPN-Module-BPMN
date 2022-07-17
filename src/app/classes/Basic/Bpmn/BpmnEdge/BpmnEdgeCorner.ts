import { Vector } from "../../../Utils/Vector";
import { Position } from "../../Interfaces/Position";
import { BpmnEdge } from "./BpmnEdge";

export class BpmnEdgeCorner implements Position{
    public edge: BpmnEdge
    constructor(x:number = 0, y:number = 0, edge:BpmnEdge){
        this._x = x
        this._y = y
        this.edge = edge
    }
    getPos(): Vector {
        return new Vector(this.x, this.y);
    }
    setPos(pos: Vector): void {
        this.x = pos.x;
        this.y = pos.y;
    }
    setPosXY(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
    private _x: number = 0;
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

}