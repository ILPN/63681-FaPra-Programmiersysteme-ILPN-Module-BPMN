import { SwitchController } from "./switch-controller";
import { SwitchableGateway } from "./SwitchableGateway";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchUtils } from "./SwitchUtils";

export class MarcelsSwitch extends SwitchController{



    
    /**
     * checks if it is possible to switch the node state
     * @param node node to switch
     * @returns true if the node state can be switched
     */
     private possibleToSwitchNode(node: SwitchableNode): boolean {
        if (node.isGateway() && (node.disabled() || node.enableable() || node.switchedButEnableForLoopRun())) {

            let gateway: SwitchableGateway = node as SwitchableGateway;
            return gateway.canBeSwitched(this.graph)

        }
        return true;
    }


    /** collects alle nodes in state enableable
     * @return enableable nodes
     */
    private getAllEnableableNodes(): SwitchableNode[] {
        let nodes: SwitchableNode[] = [];

        for (let node of this.nodes)
            if (node.enableable() || node.switchedButEnableForLoopRun())
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


    /** changes state of the clicked node and connected nodes
     * @param clickedNode the clicked node
     */
     override press_typ(clickedNode: SwitchableNode): void {
              let nodesToSwitch: SwitchableNode[] = this.my_getNodesToSwitch(clickedNode)
              nodesToSwitch.forEach(node => {
                  if (this.possibleToSwitchNode(node)) node.switch()
              });
              if (clickedNode.isGateway() && (clickedNode as SwitchableGateway).OR_JOIN()) (clickedNode as SwitchableGateway).disablePathsNotTakenAfterOrJoin(this.graph);
              this.checkAllEnableableNodesStillEnableable();
      }


        /**
     * collects all the nodes whose state should be switched
     * @param clickedNode
     * @returns nodes to switch
     */
         private my_getNodesToSwitch(clickedNode: SwitchableNode): SwitchableNode[] {
            let nodesToSwitch: SwitchableNode[] = [];
    
            //add the clicked node
            SwitchUtils.addItem(clickedNode, nodesToSwitch);
    
            // if no nodes before the clicked one
            if (clickedNode.predecessors.length === 0)
                return SwitchUtils.addItems(clickedNode.switchRegular(), nodesToSwitch);
    
            // if there is enabled gateway before the clicked node
            clickedNode.predecessors.forEach(before => {
                if (before.enabled() && before.isGateway()) { 
                    let gatewayConnections = (before as SwitchableGateway).switchSplit(clickedNode);
                    SwitchUtils.addItems(gatewayConnections, nodesToSwitch)
                } else
                    SwitchUtils.addItems(clickedNode.switchRegular(), nodesToSwitch);
            });
    
            return nodesToSwitch
        }
}
