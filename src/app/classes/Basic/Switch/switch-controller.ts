import {SwitchState} from "./switchstatetype";
import {SwitchableNode} from "./SwitchableNode";
import {SwitchableGraph} from "./SwitchableGraph";
import {SwitchableGateway} from "./SwitchableGateway";
import {SwitchUtils} from "./SwitchUtils";
import { BpmnCommonValidateServices } from "../Bpmn/bpmn-common-validate-services";
import { BpmnNode } from "../Bpmn/BpmnNode";

export class SwitchController {
    private _startEvents: SwitchableNode[];
    private nodes: SwitchableNode[];
    private _graph: SwitchableGraph;

    constructor(graph: SwitchableGraph) {
        this._startEvents = [];
        this.nodes = graph.switchNodes;
        this._graph = graph;
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
// test start
let bpmnnodes : BpmnNode[] = [];
this.nodes.forEach(element => {
    bpmnnodes.push(element.bpmnNode);
});
let b : BpmnCommonValidateServices = new BpmnCommonValidateServices(bpmnnodes); 
b.validateGraph();
// test ende



        if (clickedNode.switchState === SwitchState.enableable || clickedNode.switchState === SwitchState.switchedButEnableForLoopRun) {
            //console.log("Clicked element " + clickedNode.id);
            if (clickedNode.isStartEvent()) this.disableAllOtherStartEvents(clickedNode);


            let nodesToSwitch: SwitchableNode[] = this.getNodesToSwitch(clickedNode)
            nodesToSwitch.forEach(node => {
                if (this.possibleToSwitchNode(node)) node.switch()
            });
            if (clickedNode.isGateway() && (clickedNode as SwitchableGateway).OR_JOIN()) (clickedNode as SwitchableGateway).disablePathsNotTakenAfterOrJoin(this._graph);
            this.checkAllEnableableNodesStillEnableable();


        } else {
            //console.log("The state of this element can not be switched: " + clickedNode.id);
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

        // if no nodes before the clicked one
        if (clickedNode.predecessors.length === 0)
            return SwitchUtils.addItems(clickedNode.switchRegular(), nodesToSwitch);

        // if there is enabled gateway before the clicked node
        clickedNode.predecessors.forEach(before => {
            if (before.enabled() && before.isGateway()) { // before.enabled() &&  for loop
                let gatewayConnections = (before as SwitchableGateway).switchSplit(clickedNode);
                SwitchUtils.addItems(gatewayConnections, nodesToSwitch)
            } else
                SwitchUtils.addItems(clickedNode.switchRegular(), nodesToSwitch);
        });

        return nodesToSwitch
    }


    /**
     * checks if it is possible to switch the node state
     * @param node node to switch
     * @returns true if the node state can be switched
     */
    private possibleToSwitchNode(node: SwitchableNode): boolean {
        if (node.isGateway() && (node.disabled() || node.enableable() || node.switchedButEnableForLoopRun())) {

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
        });
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
