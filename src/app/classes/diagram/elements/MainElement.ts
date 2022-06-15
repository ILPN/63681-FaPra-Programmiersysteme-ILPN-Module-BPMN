import { MyDiagram } from '../MyDiagram';
import { Element } from './../element';
import { Arrow } from './arrow/Arrow';
export abstract class MainElement extends Element {
    abstract override createSvg(): SVGElement;
    constructor(id: string, diagram:MyDiagram) {
        super(id, diagram)
    }
    //for dragging along arrows connected to the element
    private _in_arrows: Arrow[] = [];
    public get in_arrows(): Arrow[] {
        return this._in_arrows;
    }
    public set in_arrows(value: Arrow[]) {
        this._in_arrows = value;
    }
    private _out_arrows: Arrow[] = [];
    public get out_arrows(): Arrow[] {
        return this._out_arrows;
    }
    public set out_arrows(value: Arrow[]) {
        this._out_arrows = value;
    }

    public addInArrow(arrow: Arrow) {
        this.in_arrows.push(arrow);
    }

    public addOutArrow(arrow: Arrow) {
        this.out_arrows.push(arrow);
    }
}
