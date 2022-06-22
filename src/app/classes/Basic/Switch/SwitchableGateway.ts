import { BpmnGateway } from "../Bpmn/gateways/BpmnGateway";
import { BpmnGatewayJoinAnd } from "../Bpmn/gateways/BpmnGatewayJoinAnd";
import { BpmnGatewayJoinOr } from "../Bpmn/gateways/BpmnGatewayJoinOr";
import { BpmnGatewayJoinXor } from "../Bpmn/gateways/BpmnGatewayJoinXor";
import { BpmnGatewaySplitAnd } from "../Bpmn/gateways/BpmnGatewaySplitAnd";
import { BpmnGatewaySplitOr } from "../Bpmn/gateways/BpmnGatewaySplitOr";
import { BpmnGatewaySplitXor } from "../Bpmn/gateways/BpmnGatewaySplitXor";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchState } from "./switchstatetype";
import { SwitchUtils } from "./SwitchUtils";

export class SwitchableGateway extends SwitchableNode {


    /**
     * collects nodes whose state should be switched in the case when the clicked node is preceded by a gateway
     * @param clicked clicked node
     * @returns 
     */
    switchSplit(clicked: SwitchableNode): SwitchableNode[] {

        if (this.AND_SPLIT())
            return this.switchAndSplit();

        if (this.OR_SPLIT())
            return this.switchORSplit(clicked);

        if (this.XOR_SPLIT())
            return this.switchXORSplit(clicked);


        console.warn("Failed to find Gateway type: " + typeof this + ". Check if the graph sequence is valid!")
        return [];
    }



    /** 
     * collects nodes whose state should be switched 
     * in the case when the clicked node is preceded by AND_SPLIT gateway these should be:
     * 1. AND_SPLIT gateway 
     * 2. all the successors of this AND_SPLIT gateway
     * 3. all the successors of the successors of the AND_SPLIT gateway
   * @param before AND_SPLIT gateway that is predecessor of the clicked node
   * @returns array of nodes whose state should be changed 
   */
    private switchAndSplit(): SwitchableNode[] {

        //add AND_SPLIT gateway
        let nodesToSwitch: SwitchableNode[] = [this];

        //successors of AND_SPLIT gateway
        this.successors().forEach((after: SwitchableNode) => SwitchUtils.addNodeToArray(after, nodesToSwitch));


        // successors of the successors of the AND_SPLIT gateway
        this.successors().forEach(after => {
            after.successors().forEach(afterAfter => SwitchUtils.addNodeToArray(afterAfter, nodesToSwitch));
        });

        return nodesToSwitch;
    }

    /** 
     * in the case when the clicked node is preceded by XOR_SPLIT gateway,
     * all the successors of the gateway, except the clicked one, should be disabled;
     * the state of all the successors of the clicked node should be switched
     * @param clicked clicked node
     * @returns array of nodes whose state should be changed 
     */
    private switchXORSplit(clicked: SwitchableNode): SwitchableNode[] {

        //disable all alternative successors of XOR gateway
        this.successors().forEach(after => {
            if (!(after === clicked)) {
                after.disable();
            }
        });

        //add XOR_SPLIT gateway to switchState array
        let nodesToSwitch: SwitchableNode[] = [this];

        clicked.successors().forEach(after => SwitchUtils.addNodeToArray(after, nodesToSwitch));

        return nodesToSwitch
    }



    /**
     * if the clicked node is preceded by OR_SPLIT gateway, 
     * the state of this OR_SPLIT gateway needs to be switched 
     * as well as the state of all the successors of the clicked node
     * @param clicked 
     * @returns array of nodes whose state should be changed 
     */
    private switchORSplit(clicked: SwitchableNode): SwitchableNode[] {
        return SwitchUtils.addNodeToArray(this, clicked.successors());
    }

    private AND_SPLIT(): boolean {
        return this._bpmnNode instanceof BpmnGatewaySplitAnd
    }

    OR_SPLIT(): boolean {
        return this._bpmnNode instanceof BpmnGatewaySplitOr
    }

    private XOR_SPLIT(): boolean {
        return this._bpmnNode instanceof BpmnGatewaySplitXor
    }

    private AND_JOIN(): boolean {
        return this._bpmnNode instanceof BpmnGatewayJoinAnd
    }

    private OR_JOIN(): boolean {
        return this._bpmnNode instanceof BpmnGatewayJoinOr
    }

    private switched(): boolean {
        return this.switchState === SwitchState.switched
    }

    canBeSwitched(): boolean {

        if (this.AND_JOIN())
            return this.allNodesBeforeEnabled();

        if (this.OR_JOIN()) {
            let matchingOrSplit = this.findMatchingOrSplit();
            if (matchingOrSplit === null) {
                console.warn("Failed to find matching OR-Split gateway for OR-Join gateway with id " + this.id())
                return false;
            }
            if (!matchingOrSplit.switched())
                return false;

            return this.completedPathFromNodeExists(matchingOrSplit);
        }


        return true;
    }


    /**
     * finds first OR-Split gateway on the first path leading to this gateway 
     * @returns matching OR-Split gateway
     */
    private findMatchingOrSplit(): any {

        let nodeBefore = this.predecessors()[0];

        while (nodeBefore != null) {
            if (nodeBefore.isGateway()) {
                if ((nodeBefore as SwitchableGateway).OR_SPLIT())
                    return nodeBefore;

                //add logic in case there is a pair of OR-gateways on the path between two OR-gateways
            }
            nodeBefore = nodeBefore.predecessors()[0];
        }

        return null;
    }



    
    private allNodesBeforeEnabled(): boolean {

        for (let nodeBefore of this.predecessors())
            if (!nodeBefore.enabled())
                return false;

        return true;

    }

}
