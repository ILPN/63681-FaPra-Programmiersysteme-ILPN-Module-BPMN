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


    public getStartSvg(): SVGElement {
        // // Startereignis
        // const svg = this.createSvgElement('circle');
        // svg.setAttribute('cx', `${this.x}`);
        // svg.setAttribute('cy', `${this.y}`);
        // svg.setAttribute('r', '50');
        // svg.setAttribute('fill', 'none');
        // svg.setAttribute('stroke', 'black');
        // svg.setAttribute('stroke-width', "5");
        // this.registerSvg(svg);

        const svg = this.createSvgElement('svg');
        svg.setAttribute('x', `${this.x}`);
        svg.setAttribute('y', `${this.y}`);

        const circle = this.createSvgElement('circle');
        circle.setAttribute('r', '50');
        circle.setAttribute('transform', 'translate(56 56)');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', "3");
        svg.append(circle);
        this.registerSvg(svg);


        return svg;
    }

    public getIntermediateSvg(): SVGElement {
        // Zwischeneignis
        const svg = this.createSvgElement('svg');
        svg.setAttribute('x', `${this.x}`);
        svg.setAttribute('y', `${this.y}`);


        const circle = this.createSvgElement('circle');
        circle.setAttribute('r', '50');
        circle.setAttribute('transform', 'translate(56 56)');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', "9");
        svg.append(circle);

        const circle2 = this.createSvgElement('circle');
        circle2.setAttribute('r', '50');
        circle2.setAttribute('transform', 'translate(56 56)');
        circle2.setAttribute('fill', 'none');
        circle2.setAttribute('stroke', 'white');
        circle2.setAttribute('stroke-width', "3");
        svg.append(circle2);
        this.registerSvg(svg);
        return svg;
    }

    public getEndSvg(): SVGElement {
        // Endeereignis
        const svg = this.createSvgElement('circle');
        svg.setAttribute('x', `${this.x}`);
        svg.setAttribute('y', `${this.y}`);

        const circle = this.createSvgElement('circle');
        svg.setAttribute('r', '50');
        circle.setAttribute('transform', 'translate(56 56)');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', "9");
        svg.append(circle);
        this.registerSvg(svg);
        return svg;
    }








}
