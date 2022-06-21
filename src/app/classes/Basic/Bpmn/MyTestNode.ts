import { Vector } from "../../Utils/Vector";
import { BNode } from "../B/BNode";
import { Position } from "../Interfaces/Position";
import { Svg } from "../Svg/Svg";
import { SvgManager } from "../Svg/SvgManager/SvgManager";

export class MyTestNode extends BNode implements Position{
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


    private _svgManager: SvgManager | undefined;
    public get svgManager(): SvgManager {
        if(this._svgManager == undefined){
            this._svgManager = new SvgManager(this.id,() => Svg.circleStroke(this.x,this.y, 10, 3))
        }
        return this._svgManager;
    }
    
    constructor(id:string){
        super(id)
        
    }

}