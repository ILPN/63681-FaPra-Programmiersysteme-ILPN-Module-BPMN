import { MyDiagram } from '../MyDiagram';
import { GatewayType } from './gatewaytype'
import { MainElement } from './MainElement';

export class Gateway extends MainElement {
    private _type: GatewayType;
    private _width: number = 50;
    private _height: number = this._width;
    private _border: number = 2;
    private _scale: String = '1';

    constructor(id: string, type: GatewayType, diagram:MyDiagram) {
        super(id,diagram);
        this._type = type;
        this.distanceX = this._width - 14;
        this.distanceY = this._width - 14;
    }

    public get type(): GatewayType {
        return this._type;
    }
    public set type(value: GatewayType) {
        this._type = value;
    }

    public createSvg(): SVGElement {
        let svg = this.createGroundSVG();
        let rect = this.createRect();
        svg.append(rect);
        svg.append(this.createTypeSvg());
        return svg;
    }

    private createGroundSVG(): SVGElement {
        let svg = this.createSvgElement('svg');
        svg.setAttribute('width', `${this._width}`);
        svg.setAttribute('height', `${this._height}`);
        svg.setAttribute('x', `${this.x - this._width / 2}`);
        svg.setAttribute('y', `${this.y - this._height / 2}`);
        svg.setAttribute('style', 'overflow: visible;');
        return svg;
    }

    private createRect(): SVGElement {
        let rect = this.createSvgElement('rect');
        rect.setAttribute('width', `${this._width}`);
        rect.setAttribute('height', `${this._height}`);
        rect.setAttribute('stroke', 'rgb(0,0,0)');
        rect.setAttribute('stroke-width', `${this._border}`);
        rect.setAttribute('fill', 'white');
        rect.setAttribute('transform', 'rotate(-45 ' + `${(this._width / 2)}` + ' ' + `${this._height / 2}` + ')');
        return rect;
    }

    private createTypeSvg(): SVGElement {
        let type_svg = this.createSvgElement('path');
        //XOR_SPLIT, XOR_JOIN, AND_SPLIT, AND_JOIN, OR_SPLIT, OR_JOIN
        if (this._type === GatewayType.XOR_SPLIT || this._type === GatewayType.XOR_JOIN) return this.getTypeXOR();
        if (this._type === GatewayType.AND_SPLIT || this._type === GatewayType.AND_JOIN) return this.getTypeAND();
        if (this._type === GatewayType.OR_SPLIT || this._type === GatewayType.OR_JOIN) return this.getTypeOR();
        return type_svg; // default
    }



    private getTypeXOR(): SVGElement {
        let type_svg = this.createSvgElement('path');
        type_svg.setAttribute('d', 'M20,15.5L27.7,28h-5.4l-3.5-5.8c-0.5-0.9-1-1.8-1.5-2.7l-0.5-1l-0.5-0.9h-0.1l-0.5,1c-0.6,1.2-1.3,2.4-2.1,3.7L10.1,28H4.6 l8-12.5L5.1,3.8h5.5l3.2,5.4c0.5,0.9,1,1.7,1.4,2.5l0.4,0.9l0.4,0.9h0.1c0.2-0.4,0.4-0.7,0.4-0.9l0.4-0.8c0.4-0.7,0.9-1.6,1.4-2.5 l3.2-5.4h5.4L20,15.5z');
        type_svg.setAttribute('stroke', 'black');
        type_svg.setAttribute('opacity', '1');
        type_svg.setAttribute('fill', 'black');
        type_svg.setAttribute('transform', 'translate(5 5) scale(1.25)');
        return type_svg;
    }




    private getTypeAND(): SVGElement {
        let type_svg = this.createSvgElement('path');
        type_svg.setAttribute('d', 'M 1408,800 V 608 q 0,-40 -28,-68 -28,-28 -68,-28 H 896 V 96 Q 896,56 868,28 840,0 800,0 H 608 Q 568,0 540,28 512,56 512,96 V 512 H 96 Q 56,512 28,540 0,568 0,608 v 192 q 0,40 28,68 28,28 68,28 h 416 v 416 q 0,40 28,68 28,28 68,28 h 192 q 40,0 68,-28 28,-28 28,-68 V 896 h 416 q 40,0 68,-28 28,-28 28,-68 z');
        type_svg.setAttribute('stroke', 'black');
        type_svg.setAttribute('opacity', '1');
        type_svg.setAttribute('fill', 'black');
        type_svg.setAttribute('transform', 'translate(4 4) scale(0.03)');
        return type_svg;
    }


    private getTypeOR(): SVGElement {
        let type_svg = this.createSvgElement('circle');
        type_svg.setAttribute('r', (this._width * 0.42).toString());
        type_svg.setAttribute('cx', '50%');
        type_svg.setAttribute('cy', '50%');
        type_svg.setAttribute('fill', 'none');
        type_svg.setAttribute('stroke', 'black');
        type_svg.setAttribute('stroke-width', '4');
        return type_svg;
    }
}
