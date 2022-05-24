
import { Element } from './../element'
import { EventType } from './eventtype'

export class Event extends Element {
    private _label: string;
    private _type: EventType;
    private _raduis: number = 35;


    constructor(id: string, label: string, type: EventType) {
        super(id);
        this._label = label;
        this._type = type;
        this.distanceX = this._raduis + 2;
        this.distanceY = this._raduis + 2;
    }

    public get type(): EventType {
        return this._type;
    }
    public set type(value: EventType) {
        this._type = value;
    }

    public createSvg(): SVGElement {
        const svg = this.createUndergroundSVG();
        if (this._type === EventType.Start) svg.append(this.getStartSvg());
        if (this._type === EventType.Intermediate) { svg.append(this.getIntermediateSvgOut()); svg.append(this.getIntermediateSvgIn()); }
        if (this._type === EventType.End) svg.append(this.getEndSvg());
        this.registerSvg(svg);
        svg.append(this.getSVGText());
        return svg;
    }




    private createUndergroundSVG(): SVGElement {
        // // Startereignis
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', `${this.x - ((this._raduis * 2 + 5) / 2)}`);
        svg.setAttribute('y', `${this.y - ((this._raduis * 2 + 5) / 2)}`);
        svg.setAttribute('width', `${this._raduis * 2 + 5}`);
        svg.setAttribute('height', `${this._raduis * 2 + 5}`);
        svg.setAttribute('style', "overflow: visible;");
        return svg;
    }

    private getStartSvg(): SVGElement {
        // // Startereignis
        const circle = this.createSvgElement('circle');
        circle.setAttribute('id', `${this.id}` + "_circle");
        circle.setAttribute('r', `${this._raduis}`);
        circle.setAttribute('cx', '50%');
        circle.setAttribute('cy', '50%');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', "3");
        circle.appendChild(this.getSVGText());
        this.addSVGtoColorChange(circle);
        return circle;
    }

    private getIntermediateSvgOut(): SVGElement {
        // Zwischeneignis
        const circle = this.createSvgElement('circle');
        circle.setAttribute('id', `${this.id}` + "_circle");
        circle.setAttribute('r', `${this._raduis}`);
        circle.setAttribute('cx', '50%');
        circle.setAttribute('cy', '50%');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', "9");
        this.distanceX = this._raduis + 4;
        this.distanceY = this._raduis + 4;
        this.addSVGtoColorChange(circle);
        return circle;
    }

    private getIntermediateSvgIn(): SVGElement {
        // Zwischeneignis
        const circle2 = this.createSvgElement('circle');
        circle2.setAttribute('r', `${this._raduis}`);
        circle2.setAttribute('cx', '50%');
        circle2.setAttribute('cy', '50%');
        circle2.setAttribute('fill', 'none');
        circle2.setAttribute('stroke', 'white');
        circle2.setAttribute('stroke-width', "3");
        return circle2;
    }


    private getEndSvg(): SVGElement {
        // Endeereignis
        const circle = this.createSvgElement('circle');
        circle.setAttribute('id', `${this.id}` + "_circle");
        circle.setAttribute('r', `${this._raduis}`);
        circle.setAttribute('cx', '50%');
        circle.setAttribute('cy', '50%');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', "9");
        this.addSVGtoColorChange(circle);
        this.distanceX = this._raduis + 4;
        this.distanceY = this._raduis + 4;
        return circle;
    }



    private getSVGText(): SVGElement {
        const text = this.createSvgElement('text');
        text.setAttribute('x', '50%');
        text.setAttribute('y', '120%');
        text.setAttribute('font-size', '12px');
        text.setAttribute('text-align', 'justified');
        text.setAttribute('line-height', '110%');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('text-anchor', 'middle');
        let textNode = document.createTextNode(this._label);
        text.appendChild(textNode);
        return text;
    }




}
