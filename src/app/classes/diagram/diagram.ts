import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Element } from './element';

export class Diagram {
    private  _elements: Array<Element>;

    constructor() {
        this._elements = [];
    }

    

    /**
     * adds element to diagram if it doesn't exist 
     * @param element 
     * @returns added element
     */
    public addElement(element: Element): Element {
        if (!this.has(element))
            this._elements.push(element);
        return element;
    }

    /**
     * checks if diagram has element
     * @param newElement 
     * @returns true if the diagram has this element
     */
    public has(newElement: Element): boolean {
        return this._elements.some(element => element === newElement);
    }


    /**
    * @param toBeRemoved 
    * @returns removed element
    */
    removeElement(toBeRemoved: Element): Element | null {
        if (!this.has(toBeRemoved))
            return null;
            this._elements = this.elements.filter((e)=> e != toBeRemoved)
        return toBeRemoved;
    }

    get elements(): Array<Element> {
        return this._elements;
    }


}
