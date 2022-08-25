import { PnUtils } from "../../Petrinet/pn-utils";
import { BpmnNode } from "../Bpmn/BpmnNode";
import { BpmnUtils } from "../Bpmn/BpmnUtils";
import { BpmnGateway } from "../Bpmn/gateways/BpmnGateway";
import { SwitchableGraph } from "./SwitchableGraph";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchState } from "./switchstatetype";
import { SwitchUtils } from "./SwitchUtils";

export class SwitchableGateway extends SwitchableNode {
    private _combinationArray: SwitchableNode[][] = [];
    private _combinationNumber: number = 0;
    private _combinationInitialized: boolean = false;


    get combinationInitialized(): boolean {
        return this._combinationInitialized;
    }

    /**  Disables all alternative paths not taken in case of an or gateway*/
    disablePathsNotTakenAfterOrJoin(graph: SwitchableGraph): void {
        if (this.OR_JOIN()) {
            let split = this.searchCorrespondingSplitGateway(graph);
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
        let nodesToSwitch: SwitchableNode[] = [this];

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

        // nodes after the clicked one
        clicked.successors.forEach(after => {
            if (after.switchState === SwitchState.disabled || after.switchState === SwitchState.switched) SwitchUtils.addItem(after, nodesToSwitch)
        });
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
        return BpmnUtils.isSplitAnd(this.bpmnNode);
    }

    OR_SPLIT(): boolean {
        return BpmnUtils.isSplitOr(this.bpmnNode)
    }

    private XOR_SPLIT(): boolean {
        return BpmnUtils.isSplitXor(this.bpmnNode)
    }

    private AND_JOIN(): boolean {
        return BpmnUtils.isJoinAnd(this.bpmnNode)
    }

    OR_JOIN(): boolean {
        return BpmnUtils.isJoinOr(this.bpmnNode)
    }

    private XOR_JOIN(): boolean {
        return BpmnUtils.isJoinXor(this.bpmnNode)
    }



    /**
    * checks if it is possible to switch the state of this gateway
    * @returns true if the state can be switched
    */
    canBeSwitched(graph: SwitchableGraph): boolean {
        if (this.AND_JOIN())
            return this.allNodesBeforeEnabled();
        let b: boolean = true;
        if (this.OR_JOIN()) {
            return this.checkIfOrJoinGatewayCanBeSwitched(graph);
        }
        //XOR_JOIN, any _SPLIT gateway
        return true;
    }

    /**
     * checks if all nodes before this gateway are enabled
     * @returns
     */
    private checkIfOrJoinGatewayCanBeSwitched(graph: SwitchableGraph): boolean {
        let answer: boolean = true;
        for (let nodeBefore of this.predecessors)
            if (!nodeBefore.enabled()) {
                let gateway: SwitchableGateway | undefined = this.searchCorrespondingSplitGateway(graph);
                if (gateway !== undefined && answer) {
                    if (SwitchUtils.isClassicSwitch(graph.controller))
                        answer = SwitchUtils.isNoNodeUnequalDisabled(SwitchUtils.getAllElementsBetweenNodeToNodeBackward(nodeBefore, gateway, []))
                    else
                        answer = SwitchUtils.isNoNodeEnabledOrSwitched(SwitchUtils.getAllElementsBetweenNodeToNodeBackward(nodeBefore, gateway, []))
                }
            }
        return answer;
    }

    isSplitGateway(): boolean {
        return BpmnUtils.isSplitGateway(this.bpmnNode)

    }

    isJoinGateway(): boolean {
        return BpmnUtils.isJoinGateway(this.bpmnNode)
    }

    /**
     * checks if all nodes before this gateway are enabled
     * @returns
     */
    allNodesBeforeEnabled(): boolean {
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

        return BpmnUtils.splitJoinSameType(split._bpmnNode as BpmnGateway, join._bpmnNode as BpmnGateway);
    }


    /**
     * searches for the JOIN gateway corresponding to this SPLIT gateway
     * @returns matching JOIN gateway
     */
    searchCorrespondingJoinGateway(graph: SwitchableGraph): SwitchableGateway | undefined { // private
        let join = BpmnUtils.getCorrespondingJoin(this.bpmnNode as BpmnGateway)
        if (!join)
            return undefined
        return graph.nodeMap.get(join) as SwitchableGateway
    }




    /**
     * searches for the SPLIT gateway corresponding to this JOIN gateway
     * @returns matching SPLIT gateway
     */
    searchCorrespondingSplitGateway(graph: SwitchableGraph): SwitchableGateway | undefined {
        let split = BpmnUtils.getCorrespondingSplit(this.bpmnNode as BpmnGateway)
        if (!split)
            return undefined
        return graph.nodeMap.get(split) as SwitchableGateway
    }


    // ------ Classic Switch Code --------

    toggleGateway() {
        if (this._combinationArray.length > 0) {
            this.deactivateToggleGateway();
            if (this._combinationNumber < (this._combinationArray.length - 1)) {
                this._combinationNumber++;
            } else {
                this._combinationNumber = 0;
            }
            this.activateToggleGateway();
        }
    }
    /** Used for classic switching. Return a list with all Nodescombinations after a Array. */
    private getCombinationsList(graph: SwitchableGraph): SwitchableNode[][] {
        let array: SwitchableNode[][] = [];
        if (this.OR_SPLIT()) return this.getCombinationsOfIDsForOr([...this.successors], graph);

        if (this.XOR_SPLIT()) this.successors.forEach(node => {
            array.push([node]);
        });
        if (this.AND_SPLIT()) array = [[...this.successors]];
        return array;
    }

    private getCombinationsOfIDsForOr(nodesIn: SwitchableNode[], graph: SwitchableGraph): SwitchableNode[][] {
        let strIN: string[] = [];
        let strOut: string[][] = [];
        let nodesOut: SwitchableNode[][] = [];
        nodesIn.forEach(node => {
            strIN.push(node.id);
        });
        console.log("In: "+strIN);
        strIN.forEach(s => {
            strOut.push([s])
        });
        strOut.push(...PnUtils.getCombinationsOfIds([...strIN]));   
        console.log("Out: "+strOut);
        strOut.forEach(strS1 => {
            let nodesS2: SwitchableNode[] = [];
            console.log(strS1);
            strS1.forEach(s2 => {
                let nodeS2 = graph.getNode(s2);
                if (nodeS2 !== undefined) { nodesS2.push(nodeS2); }
            });
            if (nodesS2 !== undefined) { nodesOut.push(nodesS2); }
        });
        return nodesOut;
    }


    /** Used for classic switching. Enable all Nodes by this Combinationnumber. */
    private activateToggleGateway() {
        this._combinationArray[this._combinationNumber].forEach(node => {
            node.enable();
        });
    }
    /** Used for classic switching. Disable all Nodes by this Combinationnumber. */
    private deactivateToggleGateway() {
        this._combinationArray[this._combinationNumber].forEach(node => {
            node.disable();
        });
    }

    /**
    *  Used for classic switching. Activate Gateway.
    */
    activateGateway(graph: SwitchableGraph) {
        this.initializedCombination(graph);
        if (this._combinationArray.length > 0) this.activateToggleGateway();
    }

    private initializedCombination(graph: SwitchableGraph) {
        if (!this._combinationInitialized) {
            this._combinationInitialized = true;
            this._combinationArray = this.getCombinationsList(graph);
        }
    }
    // ------ Ende Classic Switch --------


}
