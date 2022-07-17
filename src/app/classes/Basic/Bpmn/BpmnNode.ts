import { Utility } from '../../Utils/Utility';
import { Vector } from '../../Utils/Vector';
import { BNode } from '../B/BNode';
import { Position } from '../Interfaces/Position';
import { Svg } from '../Svg/Svg';
import { SvgManager } from '../Svg/SvgManager/SvgManager';
import { BpmnEdge } from './BpmnEdge/BpmnEdge';

export  class BpmnNode extends BNode implements Position {
    readonly radius:number = 35
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

    private _label: string = '';
    public get label(): string {
        return this._label;
    }
    public set label(value: string) {
        if(value == undefined){
            this._label = ""
            return
        }
        this._label = value;
    }

    constructor(id: string) {
        super(id);
        //dont call subclass methods in cunstructor
    }
    private _inEdges: BpmnEdge[] = [];
    public get inEdges(): BpmnEdge[] {
        return this._inEdges;
    }
    addInEdge(inEdge:BpmnEdge){
        Utility.pushIfNotInArray(inEdge,this._inEdges)
    }

    private _outEdges: BpmnEdge[] = [];
    public get outEdges(): BpmnEdge[] {
        return this._outEdges;
    }
    addOutEdge(outEdge:BpmnEdge){
        Utility.pushIfNotInArray(outEdge,this._outEdges)
    }

    private _svgManager: SvgManager | undefined;
    public get svgManager(): SvgManager {
        if(this._svgManager == undefined){
            this._svgManager = new SvgManager(this.id,() => this.svgCreation())
        }
        return this._svgManager;
    }

    protected svgCreation(){
        return Svg.circleStroke(this.x,this.y, 10, 2)
    }
}
