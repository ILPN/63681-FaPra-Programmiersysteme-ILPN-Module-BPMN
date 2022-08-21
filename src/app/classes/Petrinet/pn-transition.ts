import { PnElement } from "./pn-element";

/**
 * transition in petri net
 */
export class Transition extends PnElement{
    _label: string
    constructor(id: string, label: string, public counter = 0){
        super(id);
        this._label = this.replaceAllWhiteSpaces(label)
        //counter is only for the cases where BpmnNode is represented by more than one transition
        //for ex., Or-Gateways
        if(counter > 0){
            this.id += counter
            this.label += counter
        }

    }

    get label(){
        return this._label
    }

    set label(newLabel: string){
        this._label = newLabel
    }

    print(): string{
       
        return this.id + " " + this.removeWhiteSpaces(this.label)
    }

    removeWhiteSpaces(value: string): string{
        return value.replace(" ", "-")
    }

    addCounterToLabelAndId(counter: number){
        this.counter = counter;
        this.id += counter;
        this.label += counter;
    }

    isCombi(): boolean{
        return false;
    }

}