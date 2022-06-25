import { BpmnGatewayJoinAnd } from "../Bpmn/gateways/BpmnGatewayJoinAnd";
import { BpmnGatewayJoinOr } from "../Bpmn/gateways/BpmnGatewayJoinOr";
import { BpmnGatewayJoinXor } from "../Bpmn/gateways/BpmnGatewayJoinXor";
import { BpmnGatewaySplitAnd } from "../Bpmn/gateways/BpmnGatewaySplitAnd";
import { BpmnGatewaySplitOr } from "../Bpmn/gateways/BpmnGatewaySplitOr";
import { BpmnGatewaySplitXor } from "../Bpmn/gateways/BpmnGatewaySplitXor";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchUtils } from "./SwitchUtils";

export class SwitchableGateway extends SwitchableNode {


    /**
     * collects nodes whose state should be switched in the case when 
     * the clicked node is preceded by this gateway
     * @param clicked clicked node
     * @returns nodes to switch
     */
    switchSplit(clicked: SwitchableNode): SwitchableNode[] {

        if (this.AND_SPLIT())
            return this.switchAndSplit();

        if (this.OR_SPLIT())
            return this.switchOrSplit(clicked);

        if (this.XOR_SPLIT())
            return this.switchXorSplit(clicked);

        if (this.OR_JOIN() || this.OR_JOIN() || this.AND_JOIN())
            return [];

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
        this.successors.forEach((after: SwitchableNode) => SwitchUtils.addItem(after, nodesToSwitch));


        // successors of the successors of the AND_SPLIT gateway
        this.successors.forEach(after => {
            after.successors.forEach(afterAfter => SwitchUtils.addItem(afterAfter, nodesToSwitch));
        });

        return nodesToSwitch;
    }

    /** 
     * collects nodes  whose state should be switched:
     * in the case when the clicked node is after this XOR_SPLIT gateway,
     * 1. all the successors of this gateway, except the clicked one, should be disabled;
     * 2. the state of all the successors of the clicked node should be switched
     * @param clicked clicked node
     * @returns nodes to switch 
     */
    private switchXorSplit(clicked: SwitchableNode): SwitchableNode[] {

        //disable all alternative successors of this XOR gateway
        this.successors.forEach(after => {
            if (!(after === clicked)) {
                after.disable();
            }
        });

        //add this XOR_SPLIT gateway to switchState array
        let nodesToSwitch: SwitchableNode[] = [this];

        clicked.successors.forEach(after => SwitchUtils.addItem(after, nodesToSwitch));

        return nodesToSwitch
    }



    /**
     * collects nodes  whose state should be switched:
     * if the clicked node is after this OR_SPLIT gateway, 
     * 1. the state of this OR_SPLIT gateway needs to be switched 
     * 2. as well as the state of all the successors of the clicked node
     * @param clicked 
     * @returns nodes to switch
     */
     private switchOrSplit(clicked: SwitchableNode): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [this];
        //gateway
        SwitchUtils.addItem(this, nodesToSwitch);

        //nodes after the clicked one
        SwitchUtils.addItems(clicked.successors, nodesToSwitch);

        return nodesToSwitch
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

    /**
    * checks if it is possible to switch the state of this gateway 
    * @returns true if the state can be switched
    */
    canBeSwitched(): boolean {

        if (this.AND_JOIN())
            return this.allNodesBeforeEnabled();

        let b: boolean = true;
        if (this.OR_JOIN()) {
            let i: number = 0;
            this.predecessors.forEach(before => {
                if (before.enabled()) { i++; } else {
                    b = this.switchController.recursivelySearchForResponsibleSplitGateway(before, []);
                }
            });
            return b && i>0;
        }

        //XOR_JOIN, any _SPLIT gateway
        return true;
    }

    isSplitGateway(): boolean {
        return this.AND_SPLIT() || this.OR_SPLIT() || this.XOR_SPLIT();
    }

    /**
     * checks if all nodes before this gateway are enabled
     * @returns 
     */
    private allNodesBeforeEnabled(): boolean {

        for (let nodeBefore of this.predecessors)
            if (!nodeBefore.enabled())
                return false;

        return true;

    }

}
