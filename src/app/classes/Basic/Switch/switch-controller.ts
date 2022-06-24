import { SwitchState } from "./switchstatetype";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchableGraph } from "./SwitchableGraph";
import { SwitchableGateway } from "./SwitchableGateway";
import { SwitchUtils } from "./SwitchUtils";

export class SwitchController {
    private _startEvents: SwitchableNode[];
    private nodes: SwitchableNode[];

    constructor(graph: SwitchableGraph) {
        this._startEvents = [];
        this.nodes = graph.switchNodes
    }

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

    /** changes state of the clicked node and connected nodes
     * @param clickedNode the clicked node 
     */
    public press(clickedNode: SwitchableNode) {
        if (clickedNode.switchState === SwitchState.enableable) {
            console.log("Clicked element " + clickedNode.id);
            if (clickedNode.isStartEvent()) this.disableAllOtherStartEvents(clickedNode);
            let nodesToSwitch: SwitchableNode[] = this.getNodesToSwitch(clickedNode)


            nodesToSwitch.forEach(node => { if (this.possibleToSwitchNode(node)) node.switch() });
            this.checkAllEnableableNodesStillEnableable();
        } else {
            console.log("The state of this element can not be switched: " + clickedNode.id);
            if (clickedNode.enabled() && clickedNode.isEndEvent()) {
                this.newGame();
            }
        }
    }

    /**
     * collects all the nodes whose state should be switched
     * @param clickedNode 
     * @returns nodes to switch
     */
    private getNodesToSwitch(clickedNode: SwitchableNode): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];

        //add the clicked node
        SwitchUtils.addItem(clickedNode, nodesToSwitch);

        // if there is enabled gateway before the clicked node 
        clickedNode.predecessors.forEach(before => {
            if (before.enabled() && before.isGateway()) {
                let gatewayConnections = (before as SwitchableGateway).switchSplit(clickedNode);
                SwitchUtils.addItems(gatewayConnections, nodesToSwitch)
            }
        });

        // other nodes connected to the clicked node
        SwitchUtils.addItems(clickedNode.switchRegular(), nodesToSwitch);

        return nodesToSwitch
    }


    /**
     * checks if it is possible to switch the node state
     * @param node node to switch 
     * @returns true if the node state can be switched
     */
    private possibleToSwitchNode(node: SwitchableNode): boolean {
        if (node.isGateway() && (node.disabled() || node.enableable())) {

            let gateway: SwitchableGateway = node as SwitchableGateway;
            return gateway.canBeSwitched()

        }
        return true;
    }



    /** collects alle nodes in state enableable 
     * @return enableable nodes
    */
    private getAllEnableableNodes(): SwitchableNode[] {
        let nodes: SwitchableNode[] = [];

        for (let node of this.nodes)
            if (node.enableable())
                nodes.push(node);

        return nodes;
    }

    /**
     * checks every enableable node and disables it if:
     * 1. its state cannot be switched
     * 2. it goes after OR_SPLIT and the corresponding JOIN is switched 
     */
    private checkAllEnableableNodesStillEnableable() {
        this.getAllEnableableNodes().forEach(node => {
            if (!this.possibleToSwitchNode(node))
                node.disable();

            node.predecessors.forEach(nodeBefore => {
                if (nodeBefore.isGateway()) {
                    let gateway: SwitchableGateway = nodeBefore as SwitchableGateway
                    if (gateway.OR_SPLIT() && !this.recursivelySearchForResponsibleJoinGateway(node, []))
                        node.disable();
                }
            });

        });
    }

    /**
* searches recursively for the split gateway before the element,
* checks if there is at least one switched element on the path to the gateway and
* if so - returns true
* @param node the node from which the search for the split gateway starts
* @param gatewayArray pass empty array when calling this method: '[]'. Recursively collects gateways
* @return false  at least one  element on the path to the gateway is switched
*/
    recursivelySearchForResponsibleSplitGateway(node: SwitchableNode, gatewayArray: []): boolean {
        let b: boolean = true;
        if (node instanceof SwitchableGateway) {
            if (gatewayArray.length === 0) return b;
            let onlyOnce: boolean = true;
            if (node.isSplitGateway()) {
                gatewayArray.pop();
            } else {
                //any _JOIN gateway
                gatewayArray.push();
            }
            node.predecessors.forEach(before => {
                if (onlyOnce && !(before.disabled())) {
                    onlyOnce = false;
                    if (!this.recursivelySearchForResponsibleSplitGateway(before, gatewayArray)) b = false;
                }
            });
        } else {
            if (node.switchState === SwitchState.enabled) {
                b = false;
            } else {
                node.predecessors.forEach(e => {
                    if (b) {
                        if (!this.recursivelySearchForResponsibleSplitGateway(e, gatewayArray)) b = false;
                    }
                });
            }
        }
        return b;
    }


    /** 
     * recursively searches for the following JOIN gateway and returns false if the gateway is switched  
     * @param node the node from which the search for the join gateway starts
     * @param gatewayArray pass empty array when calling this method: '[]'. Recursively collects gateways
     * @return false if the found gateway is switched
     */
    recursivelySearchForResponsibleJoinGateway(node: SwitchableNode, gatewayArray: []): boolean {
        let b: boolean = true;
        if (node.isGateway()) {
            if (gatewayArray.length === 0) {
                if (node.enabled() || node.switched()) b = false;
                return b;
            }
            let onlyOnce: boolean = true;
            let gateway: SwitchableGateway = node as SwitchableGateway
            if (gateway.isSplitGateway()) {
                gatewayArray.pop();
            } else {
                gatewayArray.push();
            }
            node.successors.forEach(after => {
                if (onlyOnce && !(after.disabled())) {
                    onlyOnce = false;
                    if (b) b = this.recursivelySearchForResponsibleSplitGateway(after, gatewayArray);
                }
                return b;
            });
        } else {
            node.successors.forEach(after => {
                if (b) {
                    b = this.recursivelySearchForResponsibleJoinGateway(after, gatewayArray)
                }
            });

            return b;
        }
        return true;
    }


    /**
     * resets diagram into initial state to start switching from start event
     */
    private newGame() {
        this.nodes.forEach(node => node.disable());
        this._startEvents.forEach(event => {
            event.switchTo(SwitchState.enableable)
        });
    }

}
