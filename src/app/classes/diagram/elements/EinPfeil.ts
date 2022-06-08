import { tSCallSignatureDeclaration } from '@babel/types';
import { Element } from '../element';
import { ConnectorElement } from './connector-element';
import { Connectortype } from './connectortype';
import { Task } from './task';

export class EinPfeil extends Element {
    private _label: String;
    private _ecken: PfeilEcke[];
    private _start: Element;
    private _end: Element;

    constructor(id: string, label: string, start: Element, end: Element) {
        super(id);
        this._label = label;
        this._start = start;
        this._end = end;
        this._ecken = [];
        this.setPfeilStart(start.x, start.y)
        this.setPfeilZiel(end.x, end.y)
    }
    clearPfeilEcken(){
        this._ecken =[]
    }
    addPfeilEcke(x: number, y: number) {
        this._ecken.push(new PfeilEcke(this.id + x + ' ' + y, x, y));
    }

    get start(): Element {
        return this._start;
    }

    set start(value: Element) {
        this._start = value;
    }

    get end(): Element {
        return this._end;
    }

    set end(value: Element) {
        this._end = value;
    }
    private pfeilStart:Vector = new Vector()
    setPfeilStart (x:number, y:number){
        this.pfeilStart.x = x
        this.pfeilStart.y = y
    }
    private pfeilZiel:Vector = new Vector()
    setPfeilZiel (x:number, y:number){
        this.pfeilZiel.x = x
        this.pfeilZiel.y = y
    }
    

    public createSvg(): SVGElement {
        const spitzeLength = 10;
        const spitzeWidth = 10;
        let pathString = 'M ';
        
        let secondEcke: Vector
        let beforeLastEcke:Vector
        if(this._ecken.length>0){
            secondEcke = this._ecken[0].toVector();
            beforeLastEcke = this._ecken[this._ecken.length - 1].toVector();
        }else{
            secondEcke = this.pfeilZiel
            beforeLastEcke= this.pfeilStart
        }
        const intersectionWithStartElement = this.calculateIntersection(secondEcke,this.pfeilStart,this.start)
        pathString = pathString + `${intersectionWithStartElement.x},${intersectionWithStartElement.y} `;
        for (let i = 0; i < this._ecken.length; i++) {
            const ecke = this._ecken[i];
            pathString = pathString + `${ecke.x},${ecke.y} `;
        }
        //pathString = pathString+ `${lastEcke.x},${lastEcke.y}`
        const task = this.end as Element;
        const intersection = this.calculateIntersection(
            beforeLastEcke,
            this.pfeilZiel,
            task
        );
        pathString = pathString + `${intersection.x},${intersection.y} `;

        let pathSvg = this.createSvgElement('path');
        pathSvg.setAttribute(
            'style',
            `fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1`
        );
        pathSvg.setAttribute('d', pathString);

        const dx = this.pfeilZiel.x - beforeLastEcke.x;
        const dy = this.pfeilZiel.y - beforeLastEcke.y;
        var theta = Math.atan2(dy, dx) + Math.PI / 2; // range (-PI, PI]
        const spitzeSvg = this.createSvgElement('path');
        spitzeSvg.setAttribute(
            'style',
            `fill:#000000;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1`
        );
        const v1 = new Vector(spitzeWidth / 2, spitzeLength).rotate(theta);
        const v2 = new Vector(-spitzeWidth, 0).rotate(theta);

        spitzeSvg.setAttribute(
            'd',
            `m ${intersection.x},${intersection.y} ${v1.x},${v1.y} ${v2.x},${v2.y}`
        );


        const svg = this.createUndergroundSVG();
        svg.append(pathSvg);
        svg.append(spitzeSvg);
        this.registerSvg(svg);
        return svg;
    }
    calculateIntersection(
        outerEcke: Vector,
        innerEcke: Vector,
        task: Element
    ): Vector {
        const inside = () => {
            if (innerEcke.x > task.x + task.distanceX) return false;
            if (innerEcke.x < task.x - task.distanceX) return false;
            if (innerEcke.y > task.y + task.distanceY) return false;
            if (innerEcke.y < task.y - task.distanceY) return false;
            return true;
        };
        if (!inside()) return new Vector(innerEcke.x, innerEcke.y);
        else {
            const innerPoint = new Vector(innerEcke.x, innerEcke.y);
            const outerPoint = new Vector(outerEcke.x, outerEcke.y);
            const dv = outerPoint.minus(innerPoint);
            const center = new Vector(task.x, task.y);

            const schnittPunkteMitAxenDerKanten: Vector[] = [];
            if (dv.y != 0) {
                let axis;
                if (dv.y < 0) axis = task.y - task.distanceY;
                else axis = task.y + task.distanceY;
                // geradengleichung y = ax+b
                // x = (y-b)/a
                const a = dv.y / dv.x;
                const b = innerPoint.y;
                const x = (axis - b) / a + innerPoint.x;
                schnittPunkteMitAxenDerKanten.push(new Vector(x, axis));
            }
            if (dv.x != 0) {
                let axis;
                if (dv.x < 0) axis = task.x - task.distanceX;
                else axis = task.x + task.distanceX;
                // geradengleichung x = ay+b
                // y = (x-b)/a
                const a = dv.x / dv.y;
                const b = innerPoint.x;
                const y = (axis - b) / a + innerPoint.y;
                schnittPunkteMitAxenDerKanten.push(new Vector(axis, y));
            }
            if(schnittPunkteMitAxenDerKanten.length ==0) return new Vector(innerEcke.x, innerEcke.y)
            return schnittPunkteMitAxenDerKanten.sort(
                (v1, v2) => v1.distanceTo(center) - v2.distanceTo(center)
            )[0];
        }
    }

    private createUndergroundSVG(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', '0');
        svg.setAttribute('y', '0');
        svg.setAttribute('style', 'overflow: visible;');
        return svg;
    }
}
export class PfeilEcke extends Element {
    toVector(): Vector {
return new Vector(this.x, this.y)    }
    private _raduis: number = 10;

    constructor(id: string, x: number, y: number) {
        super(id);
        this.x = x;
        this.y = y;
    }

    public createSvg(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', `${this.x}`);
        svg.setAttribute('y', `${this.y}`);
        svg.setAttribute('style', 'overflow: visible;');

        const circle = this.createSvgElement('circle');
        circle.setAttribute('r', `${this._raduis}`);
        circle.setAttribute('fill', 'blue');
        // svg.appendChild(circle);
        // this.addSVGtoColorChange(circle);
        this.registerSvg(svg);
        return svg;
    }
}
class Vector {
    distanceTo(to: Vector): number {
        return new Vector(this.x - to.x, this.y - to.y).length();
    }
    minus(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    private _x: number;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    private _y: number;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }
    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    rotate(angle: number): Vector {
        return new Vector(
            Math.cos(angle) * this.x - Math.sin(angle) * this.y,
            Math.sin(angle) * this.x + Math.cos(angle) * this.y
        );
    }
}
