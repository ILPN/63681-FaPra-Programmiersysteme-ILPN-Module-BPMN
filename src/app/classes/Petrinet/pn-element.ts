/**
 * petri net transition or place
 */
export abstract class PnElement {

    abstract print(): string;


    constructor(public id: string) {
        this.connected = false;

    }

    connected: boolean;

    isConnected(): boolean{
        return this.connected
    }

    notConnected(): boolean{
        return !this.isConnected()
    }

    setConnected(): void{
        this.connected = true;
    }



}