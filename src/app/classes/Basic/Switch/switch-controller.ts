import { SwitchState } from "./switchstatetype";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchableGraph } from "./SwitchableGraph";
import { SwitchableGateway } from "./SwitchableGateway";
import { SwitchUtils } from "./SwitchUtils";
import { BpmnEventEnd } from "../Bpmn/events/BpmnEventEnd";

export class SwitchController {
    private switchGraph: SwitchableGraph | undefined;
    private _startEvents: SwitchableNode[];
    private nodes: SwitchableNode[];

    constructor(graph: SwitchableGraph) {
        this._startEvents = [];

        this.switchGraph = graph;
        this.nodes = graph.switchNodes
    }

    addToStartEvents(node: SwitchableNode): void {
        if (this._startEvents.includes(node))
            return
        this._startEvents.push(node);
    }

    /** after one StartEvent node has been activated - deactivates all other StartEvent nodes
    * @param theOneAndOnlyStartElement the activated StartEvent node
    */
    private disableAllOtherStartEvents(theOneAndOnlyStartElement: SwitchableNode) {
        this._startEvents.forEach(startEvent => {
            if (!(theOneAndOnlyStartElement === startEvent)) startEvent.disable();
        });
    }



    /** switches state of the clicked node and connected nodes
     * @param clickedNode the clicked node 
     */
    public press(clickedNode: SwitchableNode) {
        if (clickedNode.switchState === SwitchState.enableable) {
            console.log("Switching state of element with ID: " + clickedNode.id);
            if (clickedNode.isStartEvent()) this.disableAllOtherStartEvents(clickedNode);
            let nodesToSwitch: SwitchableNode[] = this.getNodesToSwitch(clickedNode)


            nodesToSwitch.forEach(node => { if (this.possibleToSwitchNode(node)) node.switch() });
            this.checkAllEnableableElementStillEnableable();
        } else {
            console.log("The state of this element can not be switched: " + clickedNode.id);
            if (clickedNode.enabled() && clickedNode instanceof BpmnEventEnd) {
                this.newGame();
            }
        }
    }

    /**
     * collects all the nodes whose state should be switched
     * @param clickedNode 
     * @returns nodes to be switched
     */
    private getNodesToSwitch(clickedNode: SwitchableNode): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];

        //add the clicked node
        SwitchUtils.addNodeToArray(clickedNode, nodesToSwitch);

        // if there is enabled gateway before the clicked node 
        clickedNode.predecessors().forEach(before => {
            if (before.enabled() && before.isGateway()) {
                let gatewayConnections = (before as SwitchableGateway).switchSplit(clickedNode);
                SwitchUtils.addNodesToArray(gatewayConnections, nodesToSwitch)
            }
        });

        // other nodes connected to the clicked node
        SwitchUtils.addNodesToArray(clickedNode.switchRegular(), nodesToSwitch);

        return nodesToSwitch
    }


    /** Hiermit kann überprüft werden ob das übergebene Element geschaltet werden kann. Diese Methode überprüft ob Gateway dahingeben ob die Bedingungen erfüllt sind um sie zu schalten. 
     * @param node zu üerprüfendes Element
     * @return Gibt an ob das Element geschaltet werden kann  
     */
    private possibleToSwitchNode(node: SwitchableNode): boolean {
        if (node.isGateway() && (node.disabled() || node.enableable())) {

            let gateway: SwitchableGateway = node as SwitchableGateway;
            return gateway.canBeSwitched()

        }
        return true;
    }



    /** collects alle nodes with SwitchstateType enableable 
     * @return Array of enableable nodes
    */
    private getAllEnableableNodes(): SwitchableNode[] {
        let nodes: SwitchableNode[] = [];

        for (let node of this.nodes)
            if (node.enableable())
                nodes.push(node);

        return nodes;
    }

    /**
     * Diese Methode überprüft alle aktuell aktivierbaren Elemente im Diagramms daraufhin ob sie immer noch aktiviertbar sind.
     */
    private checkAllEnableableElementStillEnableable() {
        this.getAllEnableableNodes().forEach(node => {
            if (!this.possibleToSwitchNode(node))
                node.disable();

            node.predecessors().forEach(nodeBefore => {
                if (nodeBefore.isGateway()) {
                    let gateway: SwitchableGateway = nodeBefore as SwitchableGateway
                    if (gateway.OR_SPLIT() && !this.recursivelySearchForResponsibleJoinGateway(node, []))
                        node.disable();
                }
            });

        });
    }


    /**
  * Sucht Rekursiv nach dem zuständigen Gateway, dabei überprüft es ob ein Element auf dem Pfad geschaltet ist, wenn ja gibt es false zurück.
  * @param node Ein Element das als Startpunkt für die Suche verwendet werden soll
  * @param gatewayArray Beim Methodenaufruf ist ein leeres Array zu übergeben: '[]'. Diese Array wird verwendet um bei mehreren ineinander verschachtelten Gateways navigieren zu können
  * @return Gibt im Falle das ein Element auf dem Weg zum Gateway geschaltet ist ein false zurück.
  */
    private recursivelySearchForResponsibleSplitGateway(node: SwitchableNode, gatewayArray: []): boolean {
        // let b: boolean = true;
        // if (node instanceof Gateway) {
        //     if (gatewayArray.length === 0) return b;
        //     let onlyOnce: boolean = true;
        //     if (node.type === GatewayType.AND_SPLIT || node.type === GatewayType.OR_SPLIT || node.type === GatewayType.XOR_SPLIT) {
        //         gatewayArray.pop();
        //     } else {
        //         gatewayArray.push();   //  if (element.type === GatewayType.AND_JOIN || element.type === GatewayType.OR_JOIN || element.type === GatewayType.XOR_JOIN) 
        //     }
        //     this.getAllElementsBefore(node).forEach(e => {
        //         if (onlyOnce && !(e.switchState === SwitchState.disabled)) {
        //             onlyOnce = false; if (!this.recursivelySearchForResponsibleSplitGateway(e, gatewayArray)) b = false;
        //         }
        //     });
        // } else {
        //     if (node.switchState === SwitchState.enabled) {
        //         b = false;
        //     } else {
        //         this.getAllElementsBefore(node).forEach(e => {
        //             if (b) {
        //                 if (!this.recursivelySearchForResponsibleSplitGateway(e, gatewayArray)) b = false;
        //             }
        //         });
        //     }
        // }
        // return b;
        return true;
    }

    /**
     * Sucht Rekursiv nach dem zuständigen OR Gateway, wenn dies geschaltet ist wird false zurückgegeben     
     * @param element Ein Element das als Startpunkt für die Suche verwendet werden soll
     * @param gatewayArray Beim Methodenaufruf ist ein leeres Array zu übergeben: '[]'. Diese Array wird verwendet um bei mehreren ineinander verschachtelten Gateways navigieren zu können
     * @return Gibt im Falle das das Zuständige OR Gateway geschaltet ist ein false zurück.
     */
    private recursivelySearchForResponsibleJoinGateway(node: SwitchableNode, gatewayArray: []): boolean {
        // let b: boolean = true;
        // if (element instanceof Gateway) {
        //     if (gatewayArray.length === 0) {
        //         if (element.switchState === SwitchState.enabled || element.switchState === SwitchState.switched) b = false;
        //         return b;
        //     }
        //     let onlyOnce: boolean = true;
        //     if (element.type === GatewayType.AND_SPLIT || element.type === GatewayType.OR_SPLIT || element.type === GatewayType.XOR_SPLIT) {
        //         gatewayArray.pop();
        //     } else {
        //         gatewayArray.push();
        //     }
        //     this.getAllElementsAfter(element).forEach(e => {
        //         if (onlyOnce && !(e.switchState === SwitchState.disabled)) {
        //             onlyOnce = false;
        //             if (b) b = this.recursivelySearchForResponsibleSplitGateway(e, gatewayArray);
        //         }
        //         return b;
        //     });
        // } else {
        //     this.getAllElementsAfter(element).forEach(e => {
        //         if (b) {
        //             b = this.recursivelySearchForResponsibleJoinGateway(e, gatewayArray)
        //         }
        //     });

        //     return b;
        // }
        return true;
    }

    /** Hiermit das BPMN in den Startzustand versetzt werden. */
    private newGame() {
        let elements: Element[] = [];
        this.nodes.forEach(node => node.disable());
        this._startEvents.forEach(event => {
            event.switchState = SwitchState.enableable;
            event.setColorToDefault();
        });
    }

}
