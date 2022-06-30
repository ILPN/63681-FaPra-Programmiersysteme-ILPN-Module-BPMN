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


    /**  Disables all alternative paths not taken in case of an or gateway*/
    disablePathsNotTakenAfterOrJoin(): void {
        if (this.OR_JOIN()) {
            let split = this.searchResponsibleSplitGateway();
            if (split !== undefined)
                split.successors.forEach(successor => {
                    if (successor.enableable() || successor.switchedButEnableForLoopRun()) successor.disable();
                });

        }

    }


    /**
     * collects nodes whose state should be switched in the case when 
     * the clicked node is preceded by this gateway
     * @param clicked clicked node
     * @returns nodes to switch
     */
    switchSplit(clicked: SwitchableNode): SwitchableNode[] {

        if (this.AND_SPLIT())
            return this.switchAndSplit(clicked);

        if (this.OR_SPLIT())
            return this.switchOrSplit(clicked);

        if (this.XOR_SPLIT())
            return this.switchXorSplit(clicked);

        return clicked.switchRegular()
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
    private switchAndSplit(clicked: SwitchableNode): SwitchableNode[] {


        // //add AND_SPLIT gateway
        // let nodesToSwitch: SwitchableNode[] = [this];

        // //successors of AND_SPLIT gateway
        // this.successors.forEach((after: SwitchableNode) => SwitchUtils.addItem(after, nodesToSwitch));


        // // successors of the successors of the AND_SPLIT gateway
        // this.successors.forEach(after => {
        //     after.successors.forEach(
        //         //  if (after.switchState === SwitchState.disabled || after.switchState === SwitchState.switched)
        //         afterAfter => SwitchUtils.addItem(afterAfter, nodesToSwitch)
        //         );
        // });

        // let nodesToSwitch: SwitchableNode[] = [this];
        //  this.successors.forEach(after => {
        //      if (after.switchState === SwitchState.disabled || after.switchState === SwitchState.switched) SwitchUtils.addItem(after, nodesToSwitch)
        //  });

        let nodesToSwitch: SwitchableNode[] = [this];
        //gateway         SwitchUtils.addItem(this, nodesToSwitch);

        // nodes after the clicked one
        clicked.successors.forEach(after => {
             if (after.switchState === SwitchState.disabled || after.switchState === SwitchState.switched) SwitchUtils.addItem(after, nodesToSwitch)
         });

        return nodesToSwitch;
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
        //gateway         SwitchUtils.addItem(this, nodesToSwitch);

        // nodes after the clicked one
        clicked.successors.forEach(after => {
             if (after.switchState === SwitchState.disabled || after.switchState === SwitchState.switched) SwitchUtils.addItem(after, nodesToSwitch)
         });

        // SwitchUtils.addItems(clicked.successors, nodesToSwitch); //double switch for loop

        return nodesToSwitch
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

        // clicked.successors.forEach(after => SwitchUtils.addItem(after, nodesToSwitch));
        clicked.successors.forEach(after => {
            if (after.switchState === SwitchState.disabled || after.switchState === SwitchState.switched) SwitchUtils.addItem(after, nodesToSwitch)
        });
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

    OR_JOIN(): boolean {
        return this._bpmnNode instanceof BpmnGatewayJoinOr
    }

    private XOR_JOIN(): boolean {
        return this._bpmnNode instanceof BpmnGatewayJoinXor
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
            return this.checkIfOrJoinGatewayCanBeSwitched();
        }
        //XOR_JOIN, any _SPLIT gateway
        return true;
    }

    /**
     * checks if all nodes before this gateway are enabled
     * @returns 
     */
    private checkIfOrJoinGatewayCanBeSwitched(): boolean {
        let answer: boolean = true;
        for (let nodeBefore of this.predecessors)
            if (!nodeBefore.enabled()) {
                let gateway: SwitchableGateway | undefined = this.searchResponsibleSplitGateway();
                if (gateway !== undefined && answer) answer = SwitchUtils.isNoNodeEnabledOrSwitched(SwitchUtils.getAllElementsBetweenNodeToNodeBackward(nodeBefore, gateway, []));
                // {   
                // var uhu: SwitchableNode[] = SwitchUtils.getAllElementsBetweenNodeToNodeBackward(nodeBefore, gateway, []);
                // SwitchUtils.printAllElements(nodeBefore, gateway, uhu);
                // answer = SwitchUtils.isNoNodeEnabledOrSwitched(uhu);
                // }
            }
        return answer;
    }

    isSplitGateway(): boolean {
        return this.AND_SPLIT() || this.OR_SPLIT() || this.XOR_SPLIT();
    }

    isJoinGateway(): boolean {
        return this.AND_JOIN() || this.OR_JOIN() || this.XOR_JOIN();
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

    /**
  * Returns true if split and join gateway have the same type (AND, OR, XOR)
  * @param split Splitgateway
  * @param join Joingateway
  * @returns Returns true if split and join gateway have the same type
  */
    public static splitJoinSameType(split: SwitchableGateway, join: SwitchableGateway): boolean {
        return ((split.OR_SPLIT() && join.OR_JOIN()) || (split.AND_SPLIT() && join.AND_JOIN()) || (split.XOR_SPLIT() && join.XOR_JOIN()))
    }






    /** Search For Responsible */
    searchResponsibleJoinGateway(): SwitchableGateway | undefined { // private
        let joingateway: SwitchableGateway | undefined = undefined;
        let searchBranchNode: SwitchableGateway | undefined = undefined;
        let fail: boolean = false;
        this.successors.forEach(successor => {
            if (!fail) {
                searchBranchNode = this.helpSearchRecursiveResponsibleJoinGateway(successor, []);
                if (searchBranchNode !== joingateway && searchBranchNode !== undefined && joingateway !== undefined) {
                    fail = true;
                    console.warn("The search for the responsible gateway has yielded several different hits. The Ids of the elements involved are: " + searchBranchNode.id + " and " + joingateway.id);
                } else {
                    if (searchBranchNode !== undefined && joingateway === undefined) {
                        joingateway = searchBranchNode;
                    }
                }
            };
        });
        if (!fail && joingateway !== undefined) {
            let joinGatewayNotUndefined: SwitchableGateway = joingateway;
            if (!SwitchableGateway.splitJoinSameType(this, joinGatewayNotUndefined)) {
                fail = true;
                console.warn("The search for the responsible gateway has resulted a gateway of a different type. The Ids of the elements involved are: " + this.id + " and " + joinGatewayNotUndefined.id);
            }
        }
        return (!fail) ? joingateway : undefined;
    }


    /** Search For Responsible */
    private helpSearchRecursiveResponsibleJoinGateway(searchNode: SwitchableNode, innerGatewayArray: SwitchableGateway[]): SwitchableGateway | undefined {
        let joingateway: SwitchableGateway | undefined = undefined;
        if (searchNode !== undefined)
            if (searchNode.isGateway()) {
                let searchNodeAsGateway: SwitchableGateway = searchNode as SwitchableGateway;
                if (searchNodeAsGateway.isSplitGateway()) {
                    console.warn("push Gateway to Stack with ID" + searchNodeAsGateway.id);
                    innerGatewayArray.push(searchNodeAsGateway);
                } else {
                    if (innerGatewayArray.length === 0) {
                        return searchNodeAsGateway;
                    } else {
                        var g: SwitchableGateway = innerGatewayArray.pop() as SwitchableGateway;
                        console.warn("Pop Gateway from Stack with ID" + g.id);
                    }
                }
                searchNodeAsGateway.successors.forEach(successor => {
                    console.log("start helpSearchRecursiveResponsibleJoinGateway by " + searchNodeAsGateway.id + " with id:" + successor.id + "   Array length => " + innerGatewayArray.length);
                    if (joingateway === undefined) joingateway = this.helpSearchRecursiveResponsibleJoinGateway(successor, innerGatewayArray);
                });
            } else {
                searchNode.successors.forEach(successor => {
                    console.log("start helpSearchRecursiveResponsibleJoinGateway by " + searchNode.id + " with id:" + successor.id + "   Array length => " + innerGatewayArray.length);
                    if (joingateway === undefined) joingateway = this.helpSearchRecursiveResponsibleJoinGateway(successor, innerGatewayArray);
                });
            }
        if (joingateway !== undefined) console.log("Search get " + (joingateway as SwitchableGateway).id + " ");
        return joingateway;
    }

    /** Search For Responsible */
    searchResponsibleSplitGateway(): SwitchableGateway | undefined {
        let splitGateway: SwitchableGateway | undefined = undefined;
        let searchBranchNode: SwitchableGateway | undefined = undefined;
        let fail: boolean = false;
        this.predecessors.forEach(predecessor => {
            if (!fail) {
                searchBranchNode = this.helpSearchRecursiveResponsibleSplitGateway(predecessor, []);
                if (searchBranchNode !== splitGateway && searchBranchNode !== undefined && splitGateway !== undefined) {
                    fail = true;
                    console.warn("The search for the responsible gateway has yielded several different hits. The Ids of the elements involved are: " + searchBranchNode.id + " and " + splitGateway.id);
                } else {
                    if (searchBranchNode !== undefined && splitGateway === undefined) {
                        splitGateway = searchBranchNode;
                    }
                }
            };
        });
        if (!fail && splitGateway !== undefined) {
            let joinGatewayNotUndefined: SwitchableGateway = splitGateway;
            if (!SwitchableGateway.splitJoinSameType(joinGatewayNotUndefined, this)) {
                fail = true;
                console.warn("The search for the responsible gateway has resulted a gateway of a different type. The Ids of the elements involved are: " + joinGatewayNotUndefined.id + " and " + this.id);
            }
        }
        return (!fail) ? splitGateway : undefined;
    }


    /** Search For Responsible */
    private helpSearchRecursiveResponsibleSplitGateway(searchNode: SwitchableNode, innerGatewayArray: SwitchableGateway[]): SwitchableGateway | undefined {
        let splitGateway: SwitchableGateway | undefined = undefined;
        if (searchNode !== undefined)
            if (searchNode.isGateway()) {
                let searchNodeAsGateway: SwitchableGateway = searchNode as SwitchableGateway;
                if (searchNodeAsGateway.isJoinGateway()) {
                    console.warn("push Gateway to Stack with ID " + searchNodeAsGateway.id);
                    innerGatewayArray.push(searchNodeAsGateway);
                } else {
                    if (innerGatewayArray.length === 0) {
                        return searchNodeAsGateway;
                    } else {
                        let gateway: SwitchableGateway = innerGatewayArray.pop() as SwitchableGateway;
                        console.warn("Pop Gateway from Stack with ID " + gateway.id);
                    }
                }
                searchNodeAsGateway.predecessors.forEach(predecessor => {
                    console.log("start helpSearchRecursiveResponsibleSplitGateway by " + searchNodeAsGateway.id + " with id:" + predecessor.id + "   Array length => " + innerGatewayArray.length);
                    if (splitGateway === undefined) splitGateway = this.helpSearchRecursiveResponsibleSplitGateway(predecessor, innerGatewayArray);
                });
            } else {
                searchNode.predecessors.forEach(predecessor => {
                    console.log("start helpSearchRecursiveResponsibleSplitGateway by " + searchNode.id + " with id:" + predecessor.id + "   Array length => " + innerGatewayArray.length);
                    if (splitGateway === undefined) splitGateway = this.helpSearchRecursiveResponsibleSplitGateway(predecessor, innerGatewayArray);
                });
            }
        if (splitGateway !== undefined) console.log("Search get " + (splitGateway as SwitchableGateway).id + " ");
        return splitGateway;
    }




}
