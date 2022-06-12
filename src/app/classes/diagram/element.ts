import { MyDiagram } from './MyDiagram';

export abstract class Element {
    public  diagram: MyDiagram
    private _id: string;
    private _x: number;
    private _y: number;
    private _halfWidth: number = 0;
    private _halfHeight: number = 0;
    private domSVG: SVGElement | undefined;

    /*
    private domSvgRoot: SVGElement | undefined;
    public getSvgRoot(){
        if(this.domSvgRoot == undefined){
            const root = document.getElementById("rootsvg")
            this.domSvgRoot = document.getElementById("rootsvg") as SVGElement
        }
    }*/
    constructor(id: string, diagram:MyDiagram) {
        this._id = id;
        this._x = 0;
        this._y = 0;
        this.diagram = diagram
        this.placHolderSvg = this.createSvgElement('svg');
    }

    get distanceX(): number {
        return this._halfWidth;
    }

    set distanceX(value: number) {
        this._halfWidth = value;
    }

    get distanceY(): number {
        return this._halfHeight;
    }

    set distanceY(value: number) {
        this._halfHeight = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    public abstract createSvg(): SVGElement;

    createSvgElement(name: string): SVGElement {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }


    public updateSvg():SVGElement {
        const newSvg = this.createSvg();
        this.addEventListenersToSvg(newSvg);
        if (this.domSVG != undefined && this.domSVG.isConnected ) {
            this.domSVG!.replaceWith(newSvg);
            this.domSVG = newSvg;
            return this.domSVG
        }
        this.domSVG = newSvg;
        return this.domSVG
    }


    private addEventListenersToSvg(svg: SVGElement) {
        svg.onmousedown = (event) => {
            this.onMouseDown(event)
        };
        svg.onmouseup = (event) => {
            this.onMousUp(event)
        };
        svg.onmousemove = (event) => {
            this.onMousMove(event)
        };
    }
    onMouseDown(e: MouseEvent) {
        //this.startDrag(e);
        this.diagram.onChildrenMouseDown(e, this)
    }
    onMousUp (e:MouseEvent){
        //this.stopDrag()
        this.diagram.onChildrenMouseUp(e,this)
    }
    onMousMove (e:MouseEvent){
        this.diagram.onChildrenMouseMove(e,this)
    }

    placHolderSvg: SVGElement;


    private moveSVGToLastPositionInDOM() {
        // move svgelement in dom to last position so it stays visible over other svgelements
        if (this.domSVG == undefined) return;
        const parentNode: ParentNode | null | undefined =
            this.domSVG.parentNode;
        const root = document.getElementById('rootsvg');
        //console.log(parentNode)
        parentNode?.replaceChild(this.placHolderSvg, this.domSVG);
        root?.append(this.domSVG);
    }
    private moveSVGBackToOriginalPositionInDOM() {
        if (this.domSVG == undefined) return;
        this.domSVG.remove;
        this.placHolderSvg.replaceWith(this.domSVG);
    }
}
