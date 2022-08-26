/**
 * petri net transition or place
 */
export abstract class PnElement {

    _id: string
    abstract print(): string;


    constructor(id: string) {
        this.connected = false;

        this._id = this.replaceAllWhiteSpaces(id)

    }

    get id() {
        return this._id
    }

    set id(newId: string) {
        this._id = newId
    }

    replaceAllWhiteSpaces(value: string): string {
        let newValue = value.trim()
        if (newValue.length === 0)
            return ""
        while (newValue.includes(" ")) {
            newValue = newValue.replace(" ", "-");
        }

        return newValue
    }

    connected: boolean;

    isConnected(): boolean {
        return this.connected
    }

    notConnected(): boolean {
        return !this.isConnected()
    }

    setConnected(): void {
        this.connected = true;
    }



}