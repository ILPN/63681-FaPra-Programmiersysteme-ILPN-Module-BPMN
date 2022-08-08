/**
 * for indexing places
 */
export class PlaceCounter {

    private static place_idx: number;

    static reset() {
        this.place_idx = 1

    }

    static increment() {
        this.place_idx++
    }

    static get() {
        return this.place_idx
    }


}