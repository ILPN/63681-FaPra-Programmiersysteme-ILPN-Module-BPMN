export abstract class Element{
    private _x: number;
    private _y: number;
    private _svgElement: SVGElement | undefined;
    private _next: Array<Element>;

    constructor() {
        this._x = 0;
        this._y = 0;
        this._next = [];
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

    public abstract createSvg() : SVGElement;

    createSvgElement(name: string): SVGElement {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }

    public registerSvg(svg: SVGElement) {
        this._svgElement = svg;
        this._svgElement.onmousedown = (event) => {
            this.processMouseDown(event);
        };
        this._svgElement.onmouseup = (event) => {
            this.processMouseUp(event);
        };
    }

    private processMouseDown(event: MouseEvent) {
        if (this._svgElement === undefined) {
            return;
        }
        this._svgElement.setAttribute('fill', 'red');
    }

    private processMouseUp(event: MouseEvent) {
        if (this._svgElement === undefined) {
            return;
        }
        this._svgElement.setAttribute('fill', 'black');
    }

}
