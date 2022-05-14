import { Element } from "../element";
import { TaskType } from "./tasktype";

export class Task extends Element {
    private _label: string;
    private _type: TaskType;


    constructor(id: string, label: string, type: TaskType) {
        super(id);
        this._label = label;
        this._type = type;
    }

    public get type(): TaskType {
        return this._type;
    }
    public set type(value: TaskType) {
        this._type = value;
    }

    public get label(): string {
        return this._label;
    }
    public set label(value: string) {
        this._label = value;
    }

    public createSvg(): SVGElement {
        const circle = this.createSvgElement('circle');
        circle.setAttribute('cx', `${this.x}`);
        circle.setAttribute('cy', `${this.y}`);
        circle.setAttribute('r', '25');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'black');

        this.registerSvg(circle);

        return circle;
    }



}
