import { PlaceCounter } from "./place-counter";
import { PnElement } from "./pn-element"

export class Place extends PnElement {


    private constructor(id: number, public token: number) {
        super("p_" + id)

    }

    static create(args: { isStartPlace: boolean }): Place {
        let id = PlaceCounter.get();
        PlaceCounter.increment()

        //token = 1 for start place
        if (args.isStartPlace)
            return new Place(id, 1);


        //token = 0 for non-start place
        return new Place(id, 0);
    }

    print(): string {
        return this.id + " " + this.token
    }


}