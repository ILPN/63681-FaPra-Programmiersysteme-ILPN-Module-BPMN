import { SwitchController } from "./switch-controller";
import { SwitchableGateway } from "./SwitchableGateway";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchState } from "./switchstatetype";
import { SwitchUtils } from "./SwitchUtils";

export class ClassicSwitch extends SwitchController {

    /** changes state of the clicked node and connected nodes
     * @param clickedNode the clicked node
     */
    override press_typ(clickedNode: SwitchableNode) {
        if (clickedNode.isGateway()) {
            this.switchGateway_classic(clickedNode);
        } else {
            let nodesToSwitch: SwitchableNode[] = this.getNodesToSwitch(clickedNode);
            //          this.printNodeIDFromList(nodesToSwitch);
            nodesToSwitch.forEach(node => {
                if (this.possibleToSwitchNode(node)) node.switch();
            });
        }
        this.checkAllEnabledNodesStillEnabled();

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
        SwitchUtils.addItems(this.getNodesToSwitchPredecessors(clickedNode), nodesToSwitch);
        SwitchUtils.addItems(this.getNodesToSwitchSuccessors(clickedNode), nodesToSwitch);

        return nodesToSwitch
    }


    private getNodesToSwitchPredecessors(clickedNode: SwitchableNode): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];
        clickedNode.predecessors.forEach(before => {
            console.log("PRESS: " + clickedNode.id + " ::: clickedNode.predecessors.forEach: by ID " + before.id + " analysiere     isEnabled: " + before.enabled() + " isGateway " + before.isGateway());



            // if (before.enabled() && before.isGateway()) { // before.enabled() &&  for loop
            //     console.log("PRESS: "+clickedNode.id+ " ::: clickedNode.predecessors.forEach: by ID "+before.id+" true   ");
            //     let gatewayConnections = (before as SwitchableGateway).switchSplit(clickedNode);
            //     SwitchUtils.addItems(gatewayConnections, nodesToSwitch) 
            if (before.enableable() && before.isGateway() && (before as SwitchableGateway).isSplitGateway()) { // before.enabled() &&  for loop
                console.log("PRESS: " + clickedNode.id + " ::: clickedNode.predecessors.forEach: by ID " + before.id + " true   ");


                //et gatewayConnections = (before as SwitchableGateway).switchSplit(clickedNode);
                //SwitchUtils.addItems(gatewayConnections, nodesToSwitch)

                // clickedNode.switchRegular();
                SwitchUtils.addItem(before, nodesToSwitch);
                // before.predecessors.forEach(beforeBefore => {
                //     if(beforeBefore.enabled()) { 
                //         SwitchUtils.addItem(beforeBefore, nodesToSwitch); 
                //         //beforeBefore.switchTo(SwitchState.switched);
                //     }
                // });




            } else {
                SwitchUtils.addItems(clickedNode.switchRegular(), nodesToSwitch);
                console.log("PRESS: " + clickedNode.id + " ::: clickedNode.predecessors.forEach: by ID " + before.id + " false" + " switchstate: " + before.switchState);
            }
        });

        return nodesToSwitch;
    }

    private getNodesToSwitchSuccessors(clickedNode: SwitchableNode): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];
        clickedNode.successors.forEach(after => {
            if (after.disabled()) {
                SwitchUtils.addItem(after, nodesToSwitch);
                if (after.isGateway() && (after as SwitchableGateway).isSplitGateway) (after as SwitchableGateway).activateGateway()
            }
        });
        return nodesToSwitch;
    }



    private switchGateway_classic(clickedNode: SwitchableNode) {
        let gateway = clickedNode as SwitchableGateway;
        if (gateway.isJoinGateway()) {
            gateway.switchRegular().forEach(node => {
                if (this.possibleToSwitchNode(node)) node.switch()
            });
        } else {
            if (!gateway.combinationInitialized) {
                gateway.activateGateway();
                this.switch_before(gateway);
            } else {
                gateway.toggleGateway();
            }

        }
    }
    /** Behebt das Problem dass bei zwei hintereinader geschaltete Gateways, das erste Gateway nach der Aktivierung des zweiten Gateways noch Schalten kann. */
    private switch_before(clickedNode: SwitchableNode) {
        clickedNode.predecessors.forEach(before => {
            if (before.enableable()) {
                if (this.possibleToSwitchNode(before)) before.switch();
            }
        });
    }


    /** todo */
    private possibleToSwitchNode(node: SwitchableNode): boolean {
        if (node.isGateway()) {
            let gateway = node as SwitchableGateway;
            if (gateway.isJoinGateway()) {
                console.error("Hier sind wir, bei "+gateway.id+", wir joinen in the club")
                return gateway.canBeSwitched(this.graph);
                //         if(gateway.AND_JOIN()) return gateway.allNodesBeforeEnabled();
                //         if(gateway.OR_JOIN()) {}
            }
        }
        return true;

    }

    private checkAllEnabledNodesStillEnabled() {
        this.nodes.forEach(node => {
            if (node.switchState === SwitchState.enabled && !node.isEndEvent()) {
                if (!this.checkIfIsMinOneNodeEnableable(node.successors)) node.switch();
            }

        });
    }

    private checkIfIsMinOneNodeEnableable(nodes: SwitchableNode[]): boolean {
        let answer = false;
        nodes.forEach(node => {
            if (node.switchState === SwitchState.enableable || (node.switchState === SwitchState.disabled && node.isGateway() && (node as SwitchableGateway).isJoinGateway())) {
                answer = true;
            }
        });
        return answer;
    }




}
