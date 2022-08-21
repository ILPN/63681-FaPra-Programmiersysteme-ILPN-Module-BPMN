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

    static create(args: { startPlace: boolean | false }): Place {
        let id = PlaceCounter.get();
        PlaceCounter.increment()

        let place = new Place(id);

        if (args.startPlace)
            place.setAsPetrinetStart()

        return place
    }

    print(): string {
        return this.id + " " + this._token
    }


}