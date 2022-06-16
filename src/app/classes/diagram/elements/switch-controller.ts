import { Diagram } from "../diagram";
import { Element } from "../element";
import { Event } from "./event";
import { Connector } from "./connector";
import { EinPfeil } from "./EinPfeil";
import { Gateway } from "./gateway";
import { GatewayType } from "./gatewaytype";
import { SwitchstateType } from "./switchstatetype";
import { EventType } from "./eventtype";

export class SwitchController {
    private _diagram: Diagram | undefined;
    private _startEvents: Event[];

    constructor(diagram: Diagram) {
        this._startEvents = [];
        this._diagram = diagram;
        diagram.elements.forEach(element => {
            element.switchController = this;
            if (this.switchStartEvernt(element)) {
                var startEvent: Event = (element as Event);
                this._startEvents.push(startEvent);
            }
        });
    }

    /** Diese Methode Prüft für ein übergebenes Element ob es ein Start-Event bzw. eine Instanz der Klasse Event ist die dem Eventtyp.Start angehört. Wenn ja gibt es true zurück, sonst false. 
     * @param element Zu überprüfendes Element
     * @returns Gibt true zurück wenn das Element ein Start-Event ist.
     */
    private switchStartEvernt(element: Element): boolean {
        if ((element instanceof Event) && (element.type === EventType.Start)) {
            return true;
        };
        return false;
    }

    /** Diese Methode deaktiviert alle Start-Events bis auf das ursprünglich geschaltete.
    * @param theOneAndOnlyStartElement Das geschaltete Event
    */
    private disableAllOtherStartEvent(theOneAndOnlyStartElement: Element) {
        this._startEvents.forEach(element => {
            if (!(theOneAndOnlyStartElement === element)) this.disableElement(element);
        });
    }



    /** Diese Methode wird beim Klicken auf ein Element im Diagramm aufgerufen, sie beinhaltet alle Elemente für die Schaltung.
     * @param element das Element auf dem der Mausklick durchgeführt wurde. 
     */
    public press(element: Element) {
        if (element.switchState === SwitchstateType.enableable) {
            console.log("Schalte das Element mit der ID: " +element.id);
            let elementsToSwitch: Element[] = [];
            if (this.switchStartEvernt(element)) this.disableAllOtherStartEvent(element);
            this.addElementsToSwitch(elementsToSwitch, element);
            elementsToSwitch.forEach(e => { if (this.isItPosibleToSwitchElement(e)) e.switch() });
            this.checkAllEnableableElementStillEnableable();
        } else {
            console.log("Dieses Objekt kann nicht geschaltet werden, da es nicht aktivierbar ist.");
            if (element.switchState === SwitchstateType.enable && element instanceof Event && element.type === EventType.End) {
                this.newGame();
            }
        }
    }

    /** Diese Methode fügt alle zu schaltenden Elemente dem Array hinzu. 
       * @param elementsToSwitch Bekommt ein Array des Typs Elemente übergeben und fügt in dieses alle Elemente ein die geschaltet werden müssen. 
       * @param element das Element auf dem der Mausklick durchgeführt wurde. 
       */
    private addElementsToSwitch(elementsToSwitch: Element[], element: Element): void {
        let tempElementArray = this.getAllElementsBefore(element);
        if (tempElementArray.length > 0) {
            tempElementArray.forEach(before => {
                if (before.switchState === SwitchstateType.enable && before instanceof Gateway) { //  && before.type === GatewayType.AND_SPLIT
                    this.gatewaySwitchSplit(before, elementsToSwitch, element);
                } else {
                    this.switchRegular(elementsToSwitch, element);
                }
            });
        } else {
            this.switchRegular(elementsToSwitch, element);
        }
    }

    /** Ausgliederung der Switchanweisung aus der Methode addElementsToSwitch
     *    @param before Das Gateway, welches sich vor dem geschalteten Element befindet.
     *    @param elementsToSwitch Bekommt ein Array des Typs Elemente übergeben und fügt in dieses alle Elemente ein die geschaltet werden müssen. 
     * @param element das Element auf dem der Mausklick durchgeführt wurde. 
     */
    private gatewaySwitchSplit(before: Gateway, elementsToSwitch: Element[], element: Element): void {
        switch (before.type) {
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
    }

    /** Für den Fall eines AND_SPLIT Gateways, werden das Gateway, alle nachfolgenden Elemente des Gateways und sowie alle darauffolgenden Elemente, der elementsToSwitch Liste hinzugefügt.  
    * @param before Das Gateway, welches sich vor dem geschalteten Element befindet.
    * @param elementsToSwitch Bekommt ein Array des Typs Elemente übergeben und fügt in dieses alle Elemente ein die geschaltet werden müssen. 
    */
    private switchAndSplit(elementsToSwitch: Element[], before: Element): void {
        this.addToArray(elementsToSwitch, before);
        let elementsBefore : Element[] =  this.getAllElementsAfter(before);
        elementsBefore.forEach(after => {
            this.addToArray(elementsToSwitch, after);
        });
        // Fügt man beide Anweisung in eine forEach dann werden womöglich die nachfolgenden Elemente (Gateway Join) auf aktivierbarkeit geprüft, bevor das letzte Element aktiviert ist.
        elementsBefore.forEach(after => {
            this.getAllElementsAfter(after).forEach(afterAfter => this.addToArray(elementsToSwitch, afterAfter));
        });
    }

    /** Für den Fall eines XOR_SPLIT Gateways, werden das Gateway, das betätigte Element, sowie alle darauffolgenden Elemente, der elementsToSwitch Liste hinzugefügt. Alle anderem den Gateway folgenden Elemente werden deaktivert.  
    * @param before Das Gateway, welches sich vor dem geschalteten Element befindet.
    * @param elementsToSwitch Bekommt ein Array des Typs Elemente übergeben und fügt in dieses alle Elemente ein die geschaltet werden müssen. 
    * @param element das Element auf dem der Mausklick durchgeführt wurde. 
    */
    private switchXORSplit(elementsToSwitch: Element[], before: Element, element: Element): void {
        this.getAllElementsAfter(before).forEach(after => {
            if (!(after === element)) {
                this.disableElement(after);
            }
        });
        this.addToArray(elementsToSwitch, before);
        this.addToArray(elementsToSwitch, element);
        this.getAllElementsAfter(element).forEach(after => this.addToArray(elementsToSwitch, after));
    }



    /** Für den Fall eines OR_SPLIT Gateways, werden das Gateway, das betätigte Element, sowie alle darauffolgenden Elemente, der elementsToSwitch Liste hinzugefügt. Alle anderem den Gateway folgenden Elemente bleiben unverändert. 
    * @param before Das Gateway, welches sich vor dem geschalteten Element befindet.
    * @param elementsToSwitch Bekommt ein Array des Typs Elemente übergeben und fügt in dieses alle Elemente ein die geschaltet werden müssen. 
    * @param element das Element auf dem der Mausklick durchgeführt wurde. 
    */
    private switchORSplit(elementsToSwitch: Element[], before: Element, element: Element): void {
        this.addToArray(elementsToSwitch, before);
        this.addToArray(elementsToSwitch, element);
        this.getAllElementsAfter(element).forEach(after => this.addToArray(elementsToSwitch, after));
    }

    /** Hiermit kann überprüft werden ob das übergebene Element geschaltet werden kann. Diese Methode überprüft ob Gateway dahingeben ob die Bedingungen erfüllt sind um sie zu schalten. 
     * @param element zu üerprüfendes Element
     * @return Gibt an ob das Element geschaltet werden kann  
     */
    private isItPosibleToSwitchElement(element: Element): boolean {
        if ((element instanceof Gateway) && ((element.switchState === SwitchstateType.disable) || (element.switchState === SwitchstateType.enableable))) {
            if (element.type === GatewayType.AND_SPLIT || element.type === GatewayType.OR_SPLIT || element.type === GatewayType.XOR_SPLIT || element.type === GatewayType.XOR_JOIN) return true;
            let arrayOfElements = this.getAllElementsBefore(element);
            let b: boolean = true;
            if (element.type === GatewayType.AND_JOIN) {
                arrayOfElements.forEach(e => { if (!(e.switchState === SwitchstateType.enable)) b = false; });
                return b;
            }
                if (element.type === GatewayType.OR_JOIN) {
                    let i: number = 0;
                    arrayOfElements.forEach(e => {
                        if (e.switchState === SwitchstateType.enable) { i++; } else {
                            b = this.recursivelySearchForResponsibleSplitGateway(e, []);
                        }
                    });
                    return b;
                }
            
        }
        return true;
    }

    /** Deaktiviert ein Element und aktualisiert die Anzeige für diese Element.
     * @param element das Element, welches deaktiviert werden soll
     */
    private disableElement(element: Element): void { // this.disableElement(after);
        element.switchState = SwitchstateType.disable;
        element.colorToDefault();
    }

    /** Diese Methode fügt die übergebenen Elemente dem Arry hinzu, dies jedoch nur wenn das Element noch nicht im Array enthalten ist. 
     * @param array das Array in das das Element aufgenommen werden soll.
     * @param element das Element das hinzugefügt werden soll.
    */
    private addToArray(array: Element[], element: Element): void {
        if (!array.includes(element)) array.push(element);
    }

    /** Diese Methode kann verwendet werden wenn ein Element, alle Elemente von dennen ein Verweis auf das übergebene Element kommt und alle Elemente auf die unser Element zeigt, dem übergebenen Array zum Schalten hinzugefügt werden soll. 
     * @param elementsToSwitch das Array in das das Element aufgenommen werden soll.
     * @param element das Element das hinzugefügt werden soll.
    */
    private switchRegular(elementsToSwitch: Element[], element: Element): void {
        this.addToArray(elementsToSwitch, element);
        this.getAllElementsBefore(element).forEach(before => { if (before.switchState === SwitchstateType.enable) this.addToArray(elementsToSwitch, before) });
        this.getAllElementsAfter(element).forEach(after => { if (after.switchState === SwitchstateType.disable) this.addToArray(elementsToSwitch, after) });
    }

    /** Diese Methode durchsucht das Diagramm nach allen Elemente die auf das übergebene Element zeigen. 
     * @param element Element
     * @return Ein Array mit allen Elementen die auf das Element zeigen.
    */
    private getAllElementsBefore(element: Element): Element[] {
        let elements: Element[] = [];
        this._diagram?.elements.forEach(diagramElement => {
            if (diagramElement instanceof EinPfeil || diagramElement instanceof Connector) {
                if (diagramElement.end === element) {
                    elements.push(diagramElement.start);
                }
            }
        })
        return elements;
    }

    /** Diese Methode durchsucht das Diagramm nach allen Elemente auf die das übergebene Element zeigt. 
     * @param element Element
     * @return Ein Array mit allen Elementen die auf das Element zeigen.
    */
    private getAllElementsAfter(element: Element): Element[] {
        let elements: Element[] = [];
        this._diagram?.elements.forEach(diagramElement => {
            if (diagramElement instanceof EinPfeil || diagramElement instanceof Connector) {
                if (diagramElement.start === element) {
                    elements.push(diagramElement.end);
                }
            }
        })
        return elements;
    }
    /** Diese Methode durchsucht das Diagramm nach allen Elemente die sich im Status SwitchstateType.enableable befinden
     * @return Array mit jenen Elementen
    */
    private getAllElementsWhichAreEnableable(): Element[] {
        let elements: Element[] = [];
        this._diagram?.elements.forEach(diagramElement => {
            if (diagramElement.switchState === SwitchstateType.enableable) {
                elements.push(diagramElement);
            }
        })
        return elements;
    }

    /**
     * Diese Methode überprüft alle aktuell aktivierbaren Elemente im Diagramms daraufhin ob sie immer noch aktiviertbar sind.
     */
    private checkAllEnableableElementStillEnableable() {
        this.getAllElementsWhichAreEnableable().forEach(e => {
            if (!this.isItPosibleToSwitchElement(e)) {
                this.disableElement(e);
            }
            this.getAllElementsBefore(e).forEach(element => {
                if ((element instanceof Gateway) && (element.type === GatewayType.OR_SPLIT) && !this.recursivelySearchForResponsibleJoinGateway(e, [])) {
                    this.disableElement(e);
                }
            });
        });
    }

    /**
  * Sucht Rekursiv nach dem zuständigen Gateway, dabei überprüft es ob ein Element auf dem Pfad geschaltet ist, wenn ja gibt es false zurück.
  * @param element Ein Element das als Startpunkt für die Suche verwendet werden soll
  * @param gatewayArray Beim Methodenaufruf ist ein leeres Array zu übergeben: '[]'. Diese Array wird verwendet um bei mehreren ineinander verschachtelten Gateways navigieren zu können
  * @return Gibt im Falle das ein Element auf dem Weg zum Gateway geschaltet ist ein false zurück.
  */
    private recursivelySearchForResponsibleSplitGateway(element: Element, gatewayArray: GatewayType[]): boolean {
        let b: boolean = true;
        if (element instanceof Gateway) {
            if (gatewayArray.length === 0) return b;
            let onlyOnce: boolean = true;
            if (element.type === GatewayType.AND_SPLIT || element.type === GatewayType.OR_SPLIT || element.type === GatewayType.XOR_SPLIT) {
                gatewayArray.pop();
            } else {
                gatewayArray.push();   //  if (element.type === GatewayType.AND_JOIN || element.type === GatewayType.OR_JOIN || element.type === GatewayType.XOR_JOIN) 
            }
            this.getAllElementsBefore(element).forEach(e => {
                if (onlyOnce && !(e.switchState === SwitchstateType.disable)) {
                    onlyOnce = false; if (!this.recursivelySearchForResponsibleSplitGateway(e, gatewayArray)) b = false;
                }
            });
        } else {
            if (element.switchState === SwitchstateType.enable) {
                b = false;
            } else {
                this.getAllElementsBefore(element).forEach(e => {
                    if (b) {
                        if (!this.recursivelySearchForResponsibleSplitGateway(e, gatewayArray)) b = false;
                    }
                });
            }
        }
        return b;
    }

    /**
     * Sucht Rekursiv nach dem zuständigen OR Gateway, wenn dies geschaltet ist wird false zurückgegeben     
     * @param element Ein Element das als Startpunkt für die Suche verwendet werden soll
     * @param gatewayArray Beim Methodenaufruf ist ein leeres Array zu übergeben: '[]'. Diese Array wird verwendet um bei mehreren ineinander verschachtelten Gateways navigieren zu können
     * @return Gibt im Falle das das Zuständige OR Gateway geschaltet ist ein false zurück.
     */
    private recursivelySearchForResponsibleJoinGateway(element: Element, gatewayArray: GatewayType[]): boolean {
        let b: boolean = true;
        if (element instanceof Gateway) {
            if (gatewayArray.length === 0) {
                if (element.switchState === SwitchstateType.enable || element.switchState === SwitchstateType.switched) b = false;
                return b;
            }
            let onlyOnce: boolean = true;
            if (element.type === GatewayType.AND_SPLIT || element.type === GatewayType.OR_SPLIT || element.type === GatewayType.XOR_SPLIT) {
                gatewayArray.pop();
            } else {
                gatewayArray.push();
            }
            this.getAllElementsAfter(element).forEach(e => {
                if (onlyOnce && !(e.switchState === SwitchstateType.disable)) {
                    onlyOnce = false;
                    if (b) b = this.recursivelySearchForResponsibleSplitGateway(e, gatewayArray);
                }
                return b;
            });
        } else {
            this.getAllElementsAfter(element).forEach(e => {
                if (b) {
                    b = this.recursivelySearchForResponsibleJoinGateway(e, gatewayArray)
                }
            });

            return b;
        }
        return true;
    }

    /** Hiermit das BPMN in den Startzustand versetzt werden. */
    private newGame() {
        let elements: Element[] = [];
        this._diagram?.elements.forEach(diagramElement => {
            this.disableElement(diagramElement);
        });
        this._startEvents.forEach(event => {
            event.switchState = SwitchstateType.enableable;
            event.colorToDefault();
        });
    }

}
