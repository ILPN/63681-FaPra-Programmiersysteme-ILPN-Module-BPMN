import { SwitchController } from "./switch-controller";
import { SwitchableGateway } from "./SwitchableGateway";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchUtils } from "./SwitchUtils";

export class ClassicSwitch extends SwitchController {

    /** changes state of the clicked node and connected nodes
     * @param clickedNode the clicked node
     */
    override press_typ(clickedNode: SwitchableNode) {
        let nodesToSwitch: SwitchableNode[] = [];
        if (clickedNode.isGateway()) {
            nodesToSwitch = this.switchGateway_classic(clickedNode);
        } else {
            nodesToSwitch = this.getNodesToSwitch(clickedNode);
        }
        nodesToSwitch.forEach(node => {
            if (this.possibleToSwitchNode(node)) node.switch();
        });
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

/**
    * collects all the nodes whose state should be switched before
    * @param clickedNode
    * @returns nodes to switch
    */
    private getNodesToSwitchPredecessors(clickedNode: SwitchableNode): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];
        clickedNode.predecessors.forEach(before => {
            if ((before.enableable() || before.switchedButEnableForLoopRun()) && before.isGateway() && (before as SwitchableGateway).isSplitGateway()) { 
                SwitchUtils.addItems(clickedNode.classicAllNodesBeforeToSwitch(), nodesToSwitch);
            } else {
                SwitchUtils.addItems(clickedNode.switchRegular(), nodesToSwitch);
            }
        });
        return nodesToSwitch;
    }

    /**
    * collects all the nodes whose state should be switched after
    * @param clickedNode
    * @returns nodes to switch
    */
    private getNodesToSwitchSuccessors(clickedNode: SwitchableNode): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];
        clickedNode.successors.forEach(after => {
            if (after.disabled()) {
                SwitchUtils.addItem(after, nodesToSwitch);
                if (after.isGateway() && (after as SwitchableGateway).isSplitGateway) (after as SwitchableGateway).activateGateway(this.graph)
            }
        });
        return nodesToSwitch;
    }


/**
    * collects all the nodes whose state should be switched by pressing a gateway
    * @param clickedNode
    * @returns nodes to switch
    */
    private switchGateway_classic(clickedNode: SwitchableNode) : SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];
        let gateway = clickedNode as SwitchableGateway;
        if (gateway.isJoinGateway()) {
            SwitchUtils.addItems(gateway.switchRegular(), nodesToSwitch);
            SwitchUtils.addItems(gateway.classicAllNodesBeforeToSwitch(), nodesToSwitch);
        } else {
            if (!gateway.combinationInitialized) {
                gateway.activateGateway(this.graph);
            } else {
                gateway.toggleGateway();
            }
        }
        return nodesToSwitch;
    }
 

/**
    * check it is possible to switch node, used for join gateways
    * @param node
    * @returns nodes to switch
    */
    private possibleToSwitchNode(node: SwitchableNode): boolean {
        if (node.isGateway()) {
            let gateway = node as SwitchableGateway;
            if (gateway.isJoinGateway()) {
                if(node.enabled()) return true;
                return gateway.canBeSwitched(this.graph);
            }
        }
        return true;
    }

}
