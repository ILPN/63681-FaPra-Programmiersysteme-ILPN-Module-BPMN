import { Element } from './../element'
import { GatewayType } from './gatewaytype'

export class Gateway extends Element {
    private _type: GatewayType;


    constructor(type: GatewayType) {
        super();
        this._type = type;
    }

    public get type(): GatewayType {
        return this._type;
    }
    public set type(value: GatewayType) {
        this._type = value;
    }



    public createSvg(): SVGElement {
        const ellipse = this.createSvgElement('ellipse');
        ellipse.setAttribute('cx', `${this.x}`);
        ellipse.setAttribute('cy', `${this.y}`);

        ellipse.setAttribute('rx', '25');
        ellipse.setAttribute('rx', '15');
        ellipse.setAttribute('fill', 'none');
        ellipse.setAttribute('stroke', 'black');

        this.registerSvg(ellipse);

        return ellipse;
    }



}
