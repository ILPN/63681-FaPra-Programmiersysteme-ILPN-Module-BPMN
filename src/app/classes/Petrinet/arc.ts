import { PnElement } from "./pn-element";
/**
 * represents directed connection between petri net elements
 */
export class Arc {


    errors: string = ""
    private constructor(public weight: number, public from?: PnElement, public to?: PnElement) {

    }


    static create(from: PnElement | undefined, to: PnElement | undefined): Arc {
        if (!from)
            return this.createInvalidArc(" Failed to create Arc because source element is null ")
        if (!to)
            return this.createInvalidArc(" Failed to create Arc because target element is null ")

        return new Arc(Arc.calcWeight(), from, to)
    }

    static createInvalidArc(error: string) {
        let arc: Arc = new Arc(0)

        arc.errors = error
        return arc
    }

    static calcWeight(): number {
        return 1;
    }

    valid(): boolean{
        return !this.errors
    }

    print(): string {
        if (this.from && this.to)
            return this.from.id + " " + this.to.id + " " + this.weight

        return ""
    }
}