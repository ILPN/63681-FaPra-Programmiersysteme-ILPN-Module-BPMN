import { PnElement } from "./pn-element";
/**
 * represents directed connection between petri net elements
 */
export class Arc {

    valid: boolean = true
    errors: string = ""
    private constructor(public weight: number, public from?: PnElement, public to?: PnElement) {

    }


    static create(from: PnElement | undefined, to: PnElement | undefined): Arc {
        if (!from)
            return this.createInvalidArc(" Arc konnte nicht erstellt werden, weil der Ausgangselement null ist ")
        if (!to)
            return this.createInvalidArc(" Arc konnte nicht erstellt werden, weil der Eingangselement null ist ")

        return new Arc(Arc.calcWeight(), from, to)
    }

    static createInvalidArc(error: string) {
        let arc: Arc = new Arc(0)
        arc.valid = false
        arc.errors = error
        return arc
    }

    static calcWeight(): number {
        return 1;
    }

    print(): string {
        if (this.from && this.to)
            return this.from.id + " " + this.to.id + " " + this.weight

        return ""
    }
}