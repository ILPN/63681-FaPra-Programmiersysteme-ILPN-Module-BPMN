import { BpmnUtils } from "../Bpmn/BpmnUtils";
import { BpmnGateway } from "../Bpmn/gateways/BpmnGateway";
import { SwitchableGraph } from "./SwitchableGraph";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchState } from "./switchstatetype";
import { SwitchUtils } from "./SwitchUtils";

export class SwitchController {
    private _startEvents: SwitchableNode[];
    private _nodes: SwitchableNode[];
    private _graph: SwitchableGraph;
    private isCheckedIsWellHandled: boolean = true;
 
    constructor(graph: SwitchableGraph) {
        this._startEvents = [];
        this._nodes = graph.switchNodes;
        this._graph = graph;
    }


    get nodes(): SwitchableNode[] {
        return this._nodes;
    }

    // set nodes(value: SwitchableNode[]) {
    //     this._nodes = value;
    // }

    get graph(): SwitchableGraph {
        return this._graph;
    }

    // set graph(value: SwitchableGraph) {
    //     this._graph = value;
    // }



    /**
     * adds StartEvent node to collection of startEvents
     * @param node
     */
    addToStartEvents(node: SwitchableNode): void {
        node.switchTo(SwitchState.enableable)
        SwitchUtils.addItem(node, this._startEvents)
    }

    /** when one of the StartEvents is enabled - this method disables all other StartEvents
     * @param theOneAndOnlyStartEvent the enabled StartEvent node
     */
    private disableAllOtherStartEvents(theOneAndOnlyStartEvent: SwitchableNode) {
        this._startEvents.forEach(startEvent => {
            if (!(theOneAndOnlyStartEvent === startEvent)) startEvent.disable();
        });
    }

    /**
         * resets diagram into initial state to start switching from start event
         */
    private newGame() {
        this._nodes.forEach(node => node.disable());
        this._startEvents.forEach(event => {
            event.switchTo(SwitchState.enableable)
        });
    }




    /** Print all Node IDs*/
    printNodeIDFromList(nodes: SwitchableNode[]) {
        console.log("switchcontroller/printNodeIDFromList ------ Folgende Nodes befinden sich in der Liste und sollen geschaltet werden:          ");
        let str: String = "";
        nodes.forEach(node => str += node.id + ", ");
        str += " ENDE.";
        console.log(str);
    }

    /** changes state of the clicked node and connected nodes
      * @param clickedNode the clicked node
      */
    public press(clickedNode: SwitchableNode) {
        this.checkIsWellHandled();
        if (clickedNode.switchState === SwitchState.enableable || clickedNode.switchState === SwitchState.switchedButEnableForLoopRun) {
            if (clickedNode.isStartEvent()) this.disableAllOtherStartEvents(clickedNode);
            this.press_typ(clickedNode);
        } else {

            if (clickedNode.enabled() && clickedNode.isEndEvent()) {
                this.newGame();
            } else {
                console.warn("Der Knoten mit der ID: " + clickedNode.id + " ist nicht aktivierbar, er hat den Status: " + clickedNode.switchState);
            }
        }
    }

    press_typ(clickedNode: SwitchableNode) { }






/**
 * This method checks once if the graph is Wellhandled.
 */
    checkIsWellHandled() {
        if (this.isCheckedIsWellHandled) {
            this.isCheckedIsWellHandled = false;
            let arrayOfGateways : SwitchableNode[] = [];
            this._graph.switchNodes.forEach(node => {
                if(node.isGateway()) {
                   let associateGateway = BpmnUtils.getCorrespondingGatewayWithoutType(node.bpmnNode as BpmnGateway);            
                   if (associateGateway == undefined) { 
                    console.error("undefined gateway");
                        arrayOfGateways.push(node);
                    }
                }
            });
        if(arrayOfGateways.length > 0) {
                let text : String = "Warnung: ";
                text += (arrayOfGateways.length > 1)?"Die Gateways mit den IDs: [":"Das Gateway mit der ID: [";
                arrayOfGateways.forEach(node => {
                    text += node.id +", ";
                });
                text = text.substring(0, text.length-2);
                text += (arrayOfGateways.length > 1)?"] besitzen ":"] besitzt ";
                text += "keinen oder keinen eindeutigen Partner. Dies bedeutet, dass dieser Graph nicht wellhandled ist. Bei Gateways ohne passendes Gegenstück wird die lokale Symmantik zum joinen verwendet.";
                console.error(text);
            }
        }
    }





    // /**
    //  * Print for a Gateway without associate, one times a massage for Local Symantik 
    //  */
    //  public foundNoAssociate(associate: SwitchableNode) {
    //     if(!this._switchGatewaysWithoutMate.includes(associate)) {
    //         this._switchGatewaysWithoutMate.push(associate);
    //         console.error("Warnung: Es wurde zu dem Gateway mit der ID "+associate.id+" kein passendes Gateway gefunden. Es wird daher die lokale Symmantik zum joinen verwendet.");
    //     }
    // }




    // /**
    //  * collects nodes whose needs to be switched when this node is clicked:
    //  * 1. disabled nodes after the clicked node
    //  * 2. enabled nodes before the clicked node
    //  * @returns nodes to switch
    //  */
    //  switchRegular(): SwitchableNode[] {
    //     let nodesToSwitch: SwitchableNode[] = [];
    //     SwitchUtils.addItem(this, nodesToSwitch)
    //     this._predecessors.forEach(before => {
    //         if (before.switchState === SwitchState.enabled) SwitchUtils.addItem(before, nodesToSwitch)
    //     });
    //     this._successors.forEach(after => {
    //         if (after.switchState === SwitchState.disabled || after.switchState === SwitchState.switched) SwitchUtils.addItem(after, nodesToSwitch)
    //     });

    //     return nodesToSwitch;
    // }

























}
