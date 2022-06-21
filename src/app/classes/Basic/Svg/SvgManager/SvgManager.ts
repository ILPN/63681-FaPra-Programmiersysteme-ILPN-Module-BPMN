import { Svg } from "../Svg";

export class SvgManager{
    private root!: SVGElement;
    private _svg: SVGElement | undefined;
    private id:string
    private createSvg: (()=>SVGElement) 
    constructor(id:string, svgCreation:()=>SVGElement){
        this.id = id
        this.createSvg = svgCreation
        this.initSvg()
    }
    
    initSvg(){
        this.root = Svg.container(this.id)
        this._svg = this.createSvg()
        this.root.appendChild(this._svg)
    }
    redraw() {
        const newSvg = this.createSvg();
        this._svg?.replaceWith(newSvg);
        this._svg = newSvg;
    }
    getSvg():SVGElement{
        this.redraw()
        return this.root
    }
}