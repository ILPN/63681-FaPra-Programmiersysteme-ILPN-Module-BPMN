import { PnElement } from "./pn-element";

/**
 * transition in petri net
 */
export class Transition extends PnElement{
    
    constructor(id: string, public label: string, public counter = 0){
        super(id);

        //counter is only for the cases where BpmnNode is represented by more than one transition
        //for ex., Or-Gateways
        if(counter > 0){
            this.id += counter
            this.label += counter
        }

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

}