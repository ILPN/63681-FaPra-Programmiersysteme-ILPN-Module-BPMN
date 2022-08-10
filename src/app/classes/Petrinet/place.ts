import { PlaceCounter } from "./place-counter";
import { PnElement } from "./pn-element"

export class Place extends PnElement {
    private _token: number

    private constructor(id: number) {
        super("p_" + id)

        //token = 0 for non-start place
        this._token = 0

    }

    setAsPetrinetStart() {
        this._token = 1
    }

    static create(): Place {
        let id = PlaceCounter.get();
        PlaceCounter.increment()


        return new Place(id);
    }

    print(): string {
        return this.id + " " + this._token
    }


}