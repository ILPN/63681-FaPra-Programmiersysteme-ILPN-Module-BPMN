import { Arrow } from "./elements/arrow/Arrow";

export abstract class Element {
    private _id: string;
    private _x: number;
    private _y: number;
    /** Hier kann der Abstand, welcher aus der X-Achse zu diesem Element eingehalten werden sollte, um überlappungen zu verhindert, abgelesen werden.  */
    private _distanceX: number = 0;
    /** Hier kann der Abstand, welcher aus der Y-Achse zu diesem Element eingehalten werden sollte, um überlappungen zu verhindert, abgelesen werden.  */
    private _distanceY: number = 0;
    private _svgElement: SVGElement | undefined;
    private _adjacentElements: Element[];
    /** Dieses Array von SVG Elementen beinhaltet alle Elemente, dessen fill Farbe sich ändern muss, um die Farbe des Elements zu ändern. */
    private _svgColorElements: SVGElement[];


    //for calculating distance while dragging 
    private drag_start_x: number = 0;
    private drag_start_y: number = 0;
    //for preventing mouseMove event from firing when hovering over element
    private dragging: boolean = false;

    //for dragging along arrows connected to the element
    private in_arrows: Arrow[];
    private out_arrows: Arrow[];


    constructor(id: string) {
        this._id = id;
        this._x = 0;
        this._y = 0;
        this._adjacentElements = [];
        this._svgColorElements = [];

        //incoming and outgoing arrows
        this.in_arrows = [];
        this.out_arrows = [];
    }

    public addInArrow(arrow: Arrow) {
        this.in_arrows.push(arrow);
    }

    public addOutArrow(arrow: Arrow) {
        this.out_arrows.push(arrow);
    }

    get adjacentElements(): Element[] {
        return this._adjacentElements;
    }

    get distanceX(): number {
        return this._distanceX;
    }

    set distanceX(value: number) {
        this._distanceX = value;
    }

    get distanceY(): number {
        return this._distanceY;
    }

    set distanceY(value: number) {
        this._distanceY = value;
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

        this._svgElement.onmousemove = (event) => {
            this.move(event);
        };
        document.addEventListener('mouseup', e => {
            this.dragging = false;
        });

    }

    public move(event: MouseEvent) {
        //check flag dragging to prevent move event from firing when hovering over element
        if (this.dragging) {

            //calculate diffs
            let diff_x : number = event.clientX - this.drag_start_x;
            let diff_y : number = event.clientY - this.drag_start_y;


            //drag the element  
            this.drag_X_axis(diff_x);
            this.drag_Y_axis(diff_y);


            //drag outgoing arrows
            this.out_arrows.forEach((arrow) => {
                arrow.move_to_startElement(diff_x, diff_y);
            })

             //drag incoming arrows
             this.in_arrows.forEach((arrow) => {
                arrow.move_to_endElement(diff_x, diff_y);
            })

            //update start positions for next move
            this.drag_start_x = event.clientX;
            this.drag_start_y = event.clientY;

        }
    }

    //drag along X axis
    private drag_X_axis(diff_x : number) {
        if (this._svgElement === undefined) {
            return;
        }

        let target_x: number = Number(this._svgElement.getAttribute('x')) + diff_x;
        this._svgElement.setAttribute('x', `${target_x}`);
        this.x = target_x;
    }

    //drag along Y axis
    private drag_Y_axis(diff_y : number) {
        if (this._svgElement === undefined) {
            return;
        }
        let target_y: number = Number(this._svgElement.getAttribute('y')) + diff_y;
        this._svgElement.setAttribute('y', `${target_y}`);
        this.y = target_y;
    }

    private processMouseDown(event: MouseEvent) {
        if (this._svgElement === undefined) {
            return;
        }
        this.changeColor("red")

        //signal that dragging has started
        this.dragging = true;
        this.drag_start_x = event.clientX;
        this.drag_start_y = event.clientY;
    }

    private processMouseUp(event: MouseEvent) {

        //signal that dragging has stopped
        this.dragging = false;

        if (this._svgElement === undefined) {
            return;
        }
        this.changeColor("white")

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


    /**
     * Mit dieser Methode kann dem Element eine Farbe übergeben werden, welche es alt Hintergrundfarbe setzt.
     * @param newColor neue Hintergrundfarbe als String
     */
    changeColor(newColor: string) {
        this._svgColorElements.forEach(element => element.setAttribute('fill', newColor));
    }
    /** Hiermit können SVG Elemente hinzugefügt werden, welche ihre Farbe ändern sollen für den Fall das das Element gefärbt werden soll. 
     *  @param element ein zu färbendes SVG Element
    */
    addSVGtoColorChange(element: SVGElement) {
        this._svgColorElements.push(element);
    }

}
