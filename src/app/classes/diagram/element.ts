export abstract class Element {
    private _id : string;
    private _x: number;
    private _y: number;
    private _svgElement: SVGElement | undefined;
    private _adjacentElements: Element[];
    

    constructor(id : string) {
        this._id = id;
        this._x = 0;
        this._y = 0;
        this._adjacentElements = [];
    }

    get adjacentElements(): Element[] {
        return this._adjacentElements;
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

    /**
     * adds edge from this element to target
     * @param target target of new edge
     */
    public addEdge(target: Element): void {

        if (!this.hasEdge(target))
            this._adjacentElements.push(target);
    }

    /**
     * removes edge from this element to target
     * @param target 
     * @returns 
     */
    public removeEdge(target: Element): Element | null {

        const index = this._adjacentElements.findIndex(
            (element) => Object.is(element, target)
        );

        if (index > -1) {
            return this._adjacentElements.splice(index, 1)[0];
        }

        return null;
    }

    /**
     * checks if there is edge from this element to target
     * @param target 
     * @returns true if there is edge from this element to target
     */
    public hasEdge(target: Element): boolean {
        return this._adjacentElements.some(element => element === target);
    }



}
