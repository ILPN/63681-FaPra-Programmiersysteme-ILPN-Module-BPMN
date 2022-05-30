import { tSCallSignatureDeclaration } from "@babel/types";
import { Element } from "../element";
import { ConnectorElement } from "./connector-element";
import { Connectortype } from "./connectortype";
import { Task } from "./task";

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
    }
    addPfeilEcke(x:number, y:number){
        this._ecken.push(new PfeilEcke(this.id+x+" "+y, x, y))
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

    
    public createSvg(): SVGElement {
        const spitzeLength = 10
        const spitzeWidth = 10
        let pathString = "M "

        const firstEcke = this._ecken[0]
        const secondEcke = this._ecken[1]
        pathString = pathString+ `${firstEcke.x},${firstEcke.y} `
        for (let i = 1; i < this._ecken.length-1; i++) {
            const ecke = this._ecken[i];
            pathString = pathString+ `${ecke.x},${ecke.y} `
        }
        const lastEcke = this._ecken[this._ecken.length-1]
        const beforeLastEcke = this._ecken[this._ecken.length-2]

        pathString = pathString+ `${lastEcke.x},${lastEcke.y}`
        /*
        if(this.end instanceof Task){
            const task = this.end as Task
            console.log(task.distanceX)
            const intersection = this.calculateIntersection(beforeLastEcke,lastEcke,task)
            pathString = pathString+ `${lastEcke.x-task.distanceX},${lastEcke.y} `
        }
                */
        let pathSvg = this.createSvgElement('path');
        pathSvg.setAttribute("style",`fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1`)
        pathSvg.setAttribute("d", pathString)

        

        const dx = lastEcke.x - beforeLastEcke.x
        const dy = lastEcke.y - beforeLastEcke.y
        var theta = Math.atan2(dy, dx) +(Math.PI/2); // range (-PI, PI]
        const spitzeSvg = this.createSvgElement('path')
        spitzeSvg.setAttribute("style",`fill:#000000;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1`)
        const v1 = this.rotateVector({x : spitzeWidth/2, y: spitzeLength}, theta)
        const v2 = this.rotateVector({x : -spitzeWidth, y: 0},theta)
        spitzeSvg.setAttribute("d",
        `m ${lastEcke.x},${lastEcke.y} ${v1.x},${v1.y} ${v2.x},${v2.y}`)

        
        const svg = this.createUndergroundSVG();
        svg.append(pathSvg)
        svg.append(spitzeSvg)
        this.registerSvg(svg);
        return svg;
    }
    calculateIntersection(beforeLastEcke: PfeilEcke, lastEcke: PfeilEcke, task: Task):Vector {
        const inside =() => {
            if (lastEcke.x > task.x + task.distanceX) return false
            if (lastEcke.x < task.x - task.distanceX) return false
            if (lastEcke.y > task.y + task.distanceY) return false
            if (lastEcke.y < task.y - task.distanceY) return false
            return true
          };
        if (!inside()) return new Vector(lastEcke.x, lastEcke.y)
        else{
            //not impemented
            return new Vector(1,1)
        }
    }

    rotateVector(v:{x:number, y:number}, angle:number){
        return{
            x : Math.cos(angle)* v.x - Math.sin(angle)*v.y,
            y : Math.sin(angle)* v.x + Math.cos(angle)*v.y
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
export class PfeilEcke extends Element  {
    private _raduis : number = 10;


    constructor(id: string, x: number, y: number) {
        super(id);
        this.x = x
        this.y = y
    }

    public createSvg(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', `${this.x}`);
        svg.setAttribute('y', `${this.y}`);
        svg.setAttribute('style', "overflow: visible;");

        const circle = this.createSvgElement('circle');
        circle.setAttribute('r', `${this._raduis}`);
        circle.setAttribute('fill', 'blue');
        svg.appendChild(circle);
        this.addSVGtoColorChange(circle);
        this.registerSvg(svg);
        return svg;
    }


}
class Vector{
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
    constructor(x:number, y:number){
        this._x = x
        this._y = y
    }
}
