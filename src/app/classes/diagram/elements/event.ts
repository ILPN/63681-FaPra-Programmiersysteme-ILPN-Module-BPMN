import { Element } from './../element'
import { EventType } from './eventtype'

export class Event extends Element {
    private _type: EventType;


    constructor(id: string, type: EventType) {
        super(id);
        this._type = type;
    }

    public get type(): EventType {
        return this._type;
    }
    public set type(value: EventType) {
        this._type = value;
    }



    public createSvg(): SVGElement {
        const rect = this.createSvgElement('rect');
        rect.setAttribute('cx', `${this.x}`);
        rect.setAttribute('cy', `${this.y}`);
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', 'black');

        this.registerSvg(rect);

        return rect;
    }



}
