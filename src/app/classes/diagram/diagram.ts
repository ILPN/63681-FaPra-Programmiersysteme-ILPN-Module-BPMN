import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Element } from './element';

export class Diagram {
    private readonly _elements: Array<Element>;

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
     * adds directed edge from source to target element
     * @param source from
     * @param target to
     */
    addEdge(source: Element, target: Element): void {

        //make sure the elements are in the diagram
        this.addElement(source);
        this.addElement(target);

        source.addEdge(target);

    }

    /**
    * removes element from diagram if it exists and removes all edges where this element is target
    * @param toBeRemoved 
    * @returns removed element
    */
    removeElement(toBeRemoved: Element): Element | null {
        if (!this.has(toBeRemoved))
            return null;

        //remove all edges where the element to be removed is the target
        this._elements.forEach(element => {
            element.removeEdge(toBeRemoved);
        });

        //remove element from the array in diagram
        const index = this._elements.findIndex(
            (element) => element === toBeRemoved
        );

        if (index > -1) {
            return this._elements.splice(index, 1)[0];
        }

        return toBeRemoved;
    }

    /**
     * removes edge between two elements
     * @param source 
     * @param target 
     */
    removeEdge(source: Element, target: Element): void {

        if (this.has(source) && this.has(target))
            source.removeEdge(target);
    }

    get elements(): Array<Element> {
        return this._elements;
    }


}
