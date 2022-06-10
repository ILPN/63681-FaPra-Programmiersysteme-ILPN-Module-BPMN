import { Diagram } from "../diagram";
import { Element } from "../element";
import { Connector } from "./connector";
import { EinPfeil } from "./EinPfeil";
import { Gateway } from "./gateway";
import { GatewayType } from "./gatewaytype";
import { SwitchstateType } from "./switchstatetype";

export class SwitchController {
    private _diagram: Diagram | undefined;


    constructor(diagram: Diagram) {
        this._diagram = diagram;
        diagram.elements.forEach(element => {
            element.switchController = this;
        });
    }

    public press(element: Element) {
        let elementsToSwitch: Element[] = [];
        if (element.switchState === SwitchstateType.enableable) {
            if (element instanceof Gateway) {
                this.switchRegular(elementsToSwitch, element);
                // elementsToSwitch.push(element);
            } else {
                this.noGateWay(elementsToSwitch, element);
            }
        }
        elementsToSwitch.forEach(e => {if(this.canSwitch(e)) e.switch()});
        this.checkIsOK();
    }

    private noGateWay(elementsToSwitch: Element[], element: Element) : void {
        var tempElementArray = this.getAllElementsBefore(element);
                if(tempElementArray.length > 0) {
                tempElementArray.forEach(before => {
                    if (before.switchState === SwitchstateType.enable && before instanceof Gateway) { //  && before.type === GatewayType.AND_SPLIT
                        switch(before.type) {
                            case GatewayType.AND_SPLIT: {
                                this.switchAndSplit(elementsToSwitch, before);
                                break;
                            }
                            case GatewayType.OR_SPLIT: {
                                this.switchORSplit(elementsToSwitch, before, element);
                                break;
                            }
                            case GatewayType.XOR_SPLIT: {
                                this.switchXORSplit(elementsToSwitch, before, element);
                                break;
                            }
                            default: {
                                this.switchRegular(elementsToSwitch, element);
                                break;
                            }
                        }                        
                    } else {
                        this.switchRegular(elementsToSwitch, element);
                    }


                });
            } else {     
                this.switchRegular(elementsToSwitch, element);
            }
                // this.switchRegular(element);




    }

    private canSwitch(element : Element) : boolean {
        if((element instanceof Gateway) && (element.switchState  === SwitchstateType.disable) ) {
            if(element.type === GatewayType.AND_SPLIT || element.type === GatewayType.OR_SPLIT ||element.type === GatewayType.XOR_SPLIT || element.type === GatewayType.XOR_JOIN) return true; 
            if(element.type === GatewayType.AND_JOIN) {
                let arrayOfElements = this.getAllElementsBefore(element);
                var b : boolean = true;
                arrayOfElements.forEach(e => { if(!(e.switchState === SwitchstateType.enable)) b = false}); //|| e.switchState === SwitchstateType.geschaltet
                return b;
            }


             if(element.type === GatewayType.OR_JOIN) {  // ACHTUNG REKURSIVER AUFRUF
                 let arrayOfElements = this.getAllElementsBefore(element);
                 var b : boolean = true;
                 var i : number = 0;
                 arrayOfElements.forEach(e => { 
                     if(e.switchState === SwitchstateType.enable) { i++; } else { 
                         b = this.checkRekursivAfterIsAktiv(e);
                     }
            //         if(!(e.switchState === SwitchstateType.aktiv)) b = false;  // || e.switchState === SwitchstateType.geschaltet
                 });
                 return b;
            }


        }
        return true;
    }

private checkRekursivAfterIsAktiv(element : Element) : boolean {
    if(element instanceof Gateway) {
        return true;
    } else {
        if(element.switchState === SwitchstateType.enable) { 
            return false; 
        } else {
            var b : boolean = true;
            this.getAllElementsBefore(element).forEach(e => { if(!this.checkRekursivAfterIsAktiv(e)) b = false; });
            return b;
        }
    }

   // let arrayOfElements = this.getAllElementsBefore(element);
   // var b : boolean = true;
   // arrayOfElements.forEach(e => { if(!(e.switchState === SwitchstateType.aktiv || e.switchState === SwitchstateType.geschaltet)) b = false});
   // return b;




    return false; //false
}




    private switchAndSplit(elementsToSwitch: Element[], before: Element) : void {
        this.addToArray(elementsToSwitch, before);
                            
        this.getAllElementsAfter(before).forEach(after => {
            
            this.addToArray(elementsToSwitch, after);
            this.getAllElementsAfter(after).forEach(afterAfter => this.addToArray(elementsToSwitch, afterAfter));
        });
    }

    private switchXORSplit(elementsToSwitch: Element[], before: Element, element: Element) : void {
        this.getAllElementsAfter(before).forEach(after => {
            if(!(after === element)) { 
                after.switchState = SwitchstateType.disable;
                after.colorToDefault();
            }
        });
        this.addToArray(elementsToSwitch, before);
        this.addToArray(elementsToSwitch, element);   
        this.getAllElementsAfter(element).forEach(after => this.addToArray(elementsToSwitch, after));
    }

    private switchORSplit(elementsToSwitch: Element[], before: Element, element: Element) : void {
        this.addToArray(elementsToSwitch, before);
        this.addToArray(elementsToSwitch, element);
        this.getAllElementsAfter(element).forEach(after => this.addToArray(elementsToSwitch, after));
        // this.getAllElementsAfter(before).forEach(after => {
            
        //     this.addToArray(elementsToSwitch, after);
        //     this.getAllElementsAfter(after).forEach(afterAfter => this.addToArray(elementsToSwitch, afterAfter));
        // });
    }

    private addToArray(array : Element[], element : Element) : void {
        if(!array.includes(element)) array.push(element);
    }


    private switchRegular(elementsToSwitch : Element[], element: Element): void {
        // element.switch();
        // this.getAllElementsBefore(element).forEach(before => { if (before.switchState === SwitchstateType.aktiv) before.switch() });
        // this.getAllElementsAfter(element).forEach(after => { if (after.switchState === SwitchstateType.deaktiviert) after.switch() });
        this.addToArray(elementsToSwitch, element);
        this.getAllElementsBefore(element).forEach(before => { if (before.switchState === SwitchstateType.enable)  this.addToArray(elementsToSwitch, before)});
        this.getAllElementsAfter(element).forEach(after => { if (after.switchState === SwitchstateType.disable)  this.addToArray(elementsToSwitch, after)});
    }




    private getAllElementsBefore(end: Element): Element[] {
        let elements: Element[] = [];
        this._diagram?.elements.forEach(diagramElement => {
            if (diagramElement instanceof EinPfeil || diagramElement instanceof Connector) {
                if (diagramElement.end === end) {
                    elements.push(diagramElement.start);
                }
            }
        })
        return elements;
    }

    private getAllElementsAfter(start: Element): Element[] {
        let elements: Element[] = [];
        this._diagram?.elements.forEach(diagramElement => {
            if (diagramElement instanceof EinPfeil || diagramElement instanceof Connector) {
                if (diagramElement.start === start) {
                    elements.push(diagramElement.end);
                }
            }
        })
        return elements;
    }

    private getAllElementsWhichAreEnableable(): Element[] {
        let elements: Element[] = [];
        this._diagram?.elements.forEach(diagramElement => {
            if (diagramElement.switchState === SwitchstateType.enableable) {
                    elements.push(diagramElement);
            }
        })
        return elements;
    }

private checkIsOK() {
    this.getAllElementsWhichAreEnableable().forEach(e => { 
        if(!this.canSwitch(e)) {
            e.switchState = SwitchstateType.disable;
            e.colorToDefault;

        }});
}



    //   this.switchNext();
    // private switchNext() : void {
    //     this._adjacentElements.forEach(element => {
    //         element.switch();
    //         element.colorToDefault();
    //     });

    // }


}
