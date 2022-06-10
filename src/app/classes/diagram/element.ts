import { SwitchController } from './elements/switch-controller';
import { SwitchstateType } from './elements/switchstatetype'

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
    private _switchState: SwitchstateType = SwitchstateType.disable;
    private _switchController: SwitchController | undefined; 


    constructor(id: string) {
        this._id = id;
        this._x = 0;
        this._y = 0;
        this._adjacentElements = [];
        this._svgColorElements = [];
    }

    get switchState(): SwitchstateType {
        return this._switchState;
    }

    set switchState(value: SwitchstateType) {
        this._switchState = value;
    }

    // get switchController(): SwitchController {
    //     if (this._switchController === undefined) {
    //         return;
    //     }
    //     return this._switchController;
    // }

    set switchController(value: SwitchController) {
        this._switchController = value;
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
    }

    private processMouseDown(event: MouseEvent) {
        if (this._svgElement === undefined) {
            return;
        }
        //this.changeColor("red");
        //this.switch();


         if (this._switchController === undefined) {
                return;
         }
         this._switchController.press(this);
    }

    private processMouseUp(event: MouseEvent) {
        if (this._svgElement === undefined) {
            return;
        }
        this. colorToDefault()
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

    /** Mit dieser Methode wird die Farbe des Elementes  */
    colorToDefault(): void {
        if (this._svgElement === undefined) {
            return;
        }
        this.changeColor(this.getColor())
    }

    private getColor(): string {
        switch (this._switchState) {
            case SwitchstateType.disable: {
                return "white";
                break;
            }
            case SwitchstateType.enableable: {
                return "yellow";
                break;
            }
            case SwitchstateType.enable: {
                return "lightgreen";
                break;
            }
            case SwitchstateType.geschaltet: {
                return "lightgray";
                break;
            }
            default: {
                return "red";
                break;
            }
        }
    }

    switch() : void {
        switch (this._switchState) {
            case SwitchstateType.disable: {
                this._switchState =  SwitchstateType.enableable
                break;
            }
            case SwitchstateType.enableable: {
                this._switchState =  SwitchstateType.enable;
                break;
            }
            case SwitchstateType.enable: {
                this._switchState =  SwitchstateType.geschaltet;
                break;
            }
            case SwitchstateType.geschaltet: {
                this._switchState =  SwitchstateType.geschaltet;
                break;
            }
            default: {
                this._switchState =  SwitchstateType.disable
                break;
            }
        }
        this.colorToDefault();
    }


}
