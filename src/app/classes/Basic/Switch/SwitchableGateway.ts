import { BpmnNode } from "../Bpmn/BpmnNode";
import { BpmnUtils } from "../Bpmn/BpmnUtils";
import { BpmnGateway } from "../Bpmn/gateways/BpmnGateway";
import { SwitchController } from "./switch-controller";
import { SwitchableGraph } from "./SwitchableGraph";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchState } from "./switchstatetype";
import { SwitchUtils } from "./SwitchUtils";

export class SwitchableGateway extends SwitchableNode {


//     override addSuccessor(node: SwitchableNode) {
//     super.addSuccessor(node);
//    // this._permutationsArray = this.getCombinationsOfNodes(this.successors);
// }


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
                if (gateway !== undefined && answer) answer = SwitchUtils.isNoNodeEnabledOrSwitched(SwitchUtils.getAllElementsBetweenNodeToNodeBackward(nodeBefore, gateway, []));
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
private _permutationsArray : SwitchableNode[][] = this.getCombinationsOfNodes(this.successors);
private _permutationNumber: number = 0;

toggleGateway() {
    console.log("Größe Array = "+this._permutationNumber +" ----- "+this._permutationsArray.length+ " "+this.successors.length);

    this._permutationsArray  = this.getCombinationsOfNodes([...this.successors]);

    this.deactivateToggleGateway();
    if(this._permutationNumber < (this._permutationsArray.length-1)) {
        this._permutationNumber++;
    } else {
        this._permutationNumber = 0;
    }
    this.activateToggleGateway();
    console.log("Größe Array = "+this._permutationNumber +" ----- "+this._permutationsArray.length+ " "+this.successors.length);
    // if(this._permutationNumber === 0) {
    //     this.activateToggleGateway();
    //     this._permutationNumber++;
    // } else {
    //     this._permutationNumber = 0;
    //     this.deactivateToggleGateway();
    // }
    

   // let num : string[] = ["1","2","3","4"]
//let newh = this.getCombinationsOfNodes(this.successors);

// console.log("it beginns:");
// newh.forEach(element => {
//     var zeile : String = "";
//     element.forEach(e => { zeile += e + " ";
//     });
//     console.log(zeile);
// });


}


/**
     * creates a list for each combination of the specified ids 
     * @param ids 
     * @returns list of lists
     */
 getCombinationsOfNodes(nodes: SwitchableNode[]): SwitchableNode[][] {
    let combis: SwitchableNode[][] = [];
    while (nodes.length >= 1) {
        //minimal combination consists of 2 values
        let combi_len: number = 1;
        while (combi_len <= nodes.length) {

            combis.push(...this.getCombinationsOfLength(nodes, combi_len))
            combi_len++;
        }

        //remove first element
        nodes.splice(0, 1);
    }

    return combis;
}

private getCombinationsOfLength(nodes: SwitchableNode[], len: number): SwitchableNode[][] {
    let combis: SwitchableNode[][] = [];

    let start: number = 1;
    let end: number = start + len - 1;
    while (end <= nodes.length) {
        //always add first element and combination of <len-1> other elements
        let combi: SwitchableNode[] = [nodes[0], ...nodes.slice(start, end)];
        combis.push(combi);

        start++;
        end++;
    }

    return combis;

}

// /**
//      * creates a list for each combination of the specified ids 
//      * @param ids 
//      * @returns list of lists
//      */
//  getCombinationsOfIds(ids: string[]): string[][] {
//     let combis: string[][] = [];
//     while (ids.length >= 1) {
//         //minimal combination consists of 2 values
//         let combi_len: number = 1;
//         while (combi_len <= ids.length) {

//             combis.push(...this.getCombinationsOfLength(ids, combi_len))
//             combi_len++;
//         }

//         //remove first element
//         ids.splice(0, 1);
//     }

//     return combis;
// }

// private getCombinationsOfLength(ids: string[], len: number): string[][] {
//     let combis: string[][] = [];

//     let start: number = 1;
//     let end: number = start + len - 1;
//     while (end <= ids.length) {
//         //always add first element and combination of <len-1> other elements
//         let combi: string[] = [ids[0], ...ids.slice(start, end)];
//         combis.push(combi);

//         start++;
//         end++;
//     }

//     return combis;

// }

activateToggleGateway() {
    this._permutationsArray[this._permutationNumber].forEach(node => {
        node.enable();
    });
}

deactivateToggleGateway() {
    this._permutationsArray[this._permutationNumber].forEach(node => {
        node.disable();
    });
}

switchGateway() {}

// ------ Ende Classic Switch --------


}

//  class permut {
//     private _permutation : SwitchableNode[] = [];

//     constructor(input : SwitchableNode[]) {
//         this._permutation = input;
//     }


//     get permutation(): Array<SwitchableNode> {
//         return this._permutation
//     }

//     addToPermutation(node: SwitchableNode) {
//         SwitchUtils.addItem(node, this._permutation)
//     }

//  }

