import { BpmnNode } from "./BpmnNode"
import { BpmnEvent } from "./events/BpmnEvent"
import { BpmnEventEnd } from "./events/BpmnEventEnd"
import { BpmnEventIntermediate } from "./events/BpmnEventIntermediate"
import { BpmnEventStart } from "./events/BpmnEventStart"
import { BpmnGateway } from "./gateways/BpmnGateway"
import { BpmnGatewayJoinAnd } from "./gateways/BpmnGatewayJoinAnd"
import { BpmnGatewayJoinOr } from "./gateways/BpmnGatewayJoinOr"
import { BpmnGatewayJoinXor } from "./gateways/BpmnGatewayJoinXor"
import { BpmnGatewaySplitAnd } from "./gateways/BpmnGatewaySplitAnd"
import { BpmnGatewaySplitOr } from "./gateways/BpmnGatewaySplitOr"
import { BpmnGatewaySplitXor } from "./gateways/BpmnGatewaySplitXor"
import { BpmnTask } from "./tasks/BpmnTask"

export class BpmnCommonValidateServices {
    private validateGraph(nodes: BpmnNode[]): void {
        let startEventNodes: BpmnNode[] = [];
        let endEventNodes: BpmnNode[] = [];
        let bpmnTasks: BpmnNode[] = [];
        let intermediateEventNodes: BpmnNode[] = [];
        let gatewayNodes: BpmnNode[] = [];

        nodes.forEach(node => {
            if (BpmnCommonValidateServices.isTask(node)) {
                bpmnTasks.push(node);
            } else {
                if (BpmnCommonValidateServices.isGateway(node)) {
                    gatewayNodes.push(node);
                } else {
                    if (BpmnCommonValidateServices.isEvent(node)) {
                        if (BpmnCommonValidateServices.isStartEvent(node)) {
                            startEventNodes.push(node);
                        } else {
                            if (BpmnCommonValidateServices.isEndEvent(node)) {
                                endEventNodes.push(node);
                            } else {
                                if (BpmnCommonValidateServices.isIntermediateEvent(node)) {
                                    intermediateEventNodes.push(node);
                                }
                            }
                        }
                    }
                }
            }
        });
    }


































    /**
   * Returns true if split and join gateway have the same type (AND, OR, XOR)
   * @param split Splitgateway
   * @param join Joingateway
   * @returns Returns true if split and join gateway have the same type
   */
    public static splitJoinSameType(split: BpmnNode, join: BpmnNode): boolean {
        return ((BpmnCommonValidateServices.isGatewayOR(split) && BpmnCommonValidateServices.isGatewayOR(join)) ||
            (BpmnCommonValidateServices.isGatewayAnd(split) && BpmnCommonValidateServices.isGatewayAnd(join))) ||
            (BpmnCommonValidateServices.isGatewayXOR(split) && BpmnCommonValidateServices.isGatewayOR(join))
    }



    /** Returns the number of incoming edges  */
    public static countInEdge(node: BpmnNode): number {
        return node.inEdges.length
    }
    /** Returns the number of outgoing edges  */
    public static countOutEdge(node: BpmnNode): number {
        return node.outEdges.length
    }




    /* Beginn: is collection */

    /**
     * checks if the node is a BpmnGateway
     * @param node
     * @returns
     */
    public static isGateway(node: BpmnNode): boolean {
        return node instanceof BpmnGateway
    }


    /**
    * checks if the node is a join BpmnGateway
    * @param node
    * @returns
    */
    public static isGatewayJoin(node: BpmnNode): boolean {
        return (node instanceof BpmnGatewayJoinAnd || node instanceof BpmnGatewayJoinOr || node instanceof BpmnGatewayJoinXor);
    }

    /**
      * checks if the node is a split BpmnGateway
      * @param node
      * @returns
      */
    public static isGatewaySplit(node: BpmnNode): boolean {
        return (node instanceof BpmnGatewaySplitAnd || node instanceof BpmnGatewaySplitOr || node instanceof BpmnGatewaySplitXor);
    }


    /**
     * checks if the node is a or  join / split BpmnGateway
     * @param node
     * @returns
     */
    public static isGatewayOR(node: BpmnNode): boolean {
        return (node instanceof BpmnGatewaySplitOr || node instanceof BpmnGatewayJoinOr);
    }

    /**
     * checks if the node is a xor  join / split BpmnGateway
     * @param node
     * @returns
     */
    public static isGatewayXOR(node: BpmnNode): boolean {
        return (node instanceof BpmnGatewaySplitXor || node instanceof BpmnGatewayJoinXor);
    }

    /**
     * checks if the node is a and join / split BpmnGateway
     * @param node
     * @returns
     */
    public static isGatewayAnd(node: BpmnNode): boolean {
        return (node instanceof BpmnGatewaySplitAnd || node instanceof BpmnGatewayJoinAnd);
    }

    /**
     * checks if the node is a BpmnTask
     * @param node
     * @returns
     */
    public static isTask(node: BpmnNode): boolean {
        return node instanceof BpmnTask
    }

    /**
     * checks if the node is a BpmnEvent
     * @param node
     * @returns
     */
    public static isEvent(node: BpmnNode): boolean {
        return node instanceof BpmnEvent
    }

    /**
     * checks if the node is a BpmnEventStart
     * @param node
     * @returns
     */
    public static isStartEvent(node: BpmnNode): boolean {
        return node instanceof BpmnEventStart
    }

    /**
     * checks if the node is a BpmnEventIntermediate
     * @param node
     * @returns
     */
    public static isIntermediateEvent(node: BpmnNode): boolean {
        return node instanceof BpmnEventIntermediate
    }

    /**
     * checks if the node is a BpmnEventEnd
     * @param node
     * @returns
     */
    public static isEndEvent(node: BpmnNode): boolean {
        return node instanceof BpmnEventEnd
    }
    /* End: is collection */




/** Search Gateway */
    // /**
    //  * searches for the JOIN gateway corresponding to this SPLIT gateway
    //  * @returns matching JOIN gateway
    //  */
    //  public static searchResponsibleJoinGateway(gateway : BpmnNode): BpmnGateway | undefined { // private
    //     let joingateway: BpmnGateway | undefined = undefined;
    //     let searchBranchNode: BpmnGateway | undefined = undefined;
    //     let fail: boolean = false;
    //     gateway.outEdges.forEach(successor => {
    //         if (!fail) {
    //             searchBranchNode = BpmnCommonValidateServices.helpSearchRecursiveResponsibleJoinGateway(successor.to, []);
    //             if (searchBranchNode !== joingateway && searchBranchNode !== undefined && joingateway !== undefined) {
    //                 fail = true;
    //                 console.warn("The search for the responsible gateway has yielded several different hits. The Ids of the elements involved are: " + searchBranchNode.id + " and " + joingateway.id);
    //             } else {
    //                 if (searchBranchNode !== undefined && joingateway === undefined) {
    //                     joingateway = searchBranchNode;
    //                 }
    //             }
    //         };
    //     });
    //     if (!fail && joingateway !== undefined) {
    //         let joinGatewayNotUndefined: BpmnGateway = joingateway;
    //         if (!BpmnCommonValidateServices.splitJoinSameType(gateway, joinGatewayNotUndefined)) {
    //             fail = true;
    //             console.warn("The search for the responsible gateway has resulted in a gateway of a different type. The Ids of the elements involved are: " + gateway.id + " and " + joinGatewayNotUndefined.id);
    //         }
    //     }
    //     return (!fail) ? joingateway : undefined;
    // }


    // /** Search For Responsible */
    // private static helpSearchRecursiveResponsibleJoinGateway(searchNode: BpmnNode, innerGatewayArray: BpmnGateway[]): BpmnGateway | undefined {
    //     let joingateway: BpmnGateway | undefined = undefined;
    //     if (searchNode !== undefined)
    //         if (BpmnCommonValidateServices.isGateway(searchNode)) {
    //             let searchNodeAsGateway: BpmnGateway = searchNode as BpmnGateway;
    //             if (BpmnCommonValidateServices.isGatewaySplit(searchNodeAsGateway)) {
    //                 console.warn("push Gateway to Stack with ID" + searchNodeAsGateway.id);
    //                 innerGatewayArray.push(searchNodeAsGateway);
    //             } else {
    //                 if (innerGatewayArray.length === 0) {
    //                     return searchNodeAsGateway;
    //                 } else {
    //                     var g: BpmnGateway = innerGatewayArray.pop() as BpmnGateway;
    //                     console.warn("Pop Gateway from Stack with ID" + g.id);
    //                 }
    //             }
    //             searchNodeAsGateway.outEdges.forEach(successor => {
    //               //  console.log("start helpSearchRecursiveResponsibleJoinGateway by " + searchNodeAsGateway.id + " with id:" + successor.id + "   Array length => " + innerGatewayArray.length);
    //                 if (joingateway === undefined) joingateway = this.helpSearchRecursiveResponsibleJoinGateway(successor.to, innerGatewayArray);
    //             });
    //         } else {
    //             searchNode.outEdges.forEach(successor => {
    //             //    console.log("start helpSearchRecursiveResponsibleJoinGateway by " + searchNode.id + " with id:" + successor.id + "   Array length => " + innerGatewayArray.length);
    //                 if (joingateway === undefined) joingateway = this.helpSearchRecursiveResponsibleJoinGateway(successor.to, innerGatewayArray);
    //             });
    //         }
    //     if (joingateway !== undefined) console.log("Search get " + (joingateway as BpmnGateway).id + " ");
    //     return joingateway;
    // }

    // /**
    //  * searches for the SPLIT gateway corresponding to this JOIN gateway
    //  * @returns matching SPLIT gateway
    //  */
    // searchResponsibleSplitGateway(): SwitchableGateway | undefined {
    //     let splitGateway: SwitchableGateway | undefined = undefined;
    //     let searchBranchNode: SwitchableGateway | undefined = undefined;
    //     let fail: boolean = false;
    //     this.predecessors.forEach(predecessor => {
    //         if (!fail) {
    //             searchBranchNode = this.helpSearchRecursiveResponsibleSplitGateway(predecessor, []);
    //             if (searchBranchNode !== splitGateway && searchBranchNode !== undefined && splitGateway !== undefined) {
    //                 fail = true;
    //                 console.warn("The search for the responsible gateway has yielded several different hits. The Ids of the elements involved are: " + searchBranchNode.id + " and " + splitGateway.id);
    //             } else {
    //                 if (searchBranchNode !== undefined && splitGateway === undefined) {
    //                     splitGateway = searchBranchNode;
    //                 }
    //             }
    //         };
    //     });
    //     if (!fail && splitGateway !== undefined) {
    //         let joinGatewayNotUndefined: SwitchableGateway = splitGateway;
    //         if (!SwitchableGateway.splitJoinSameType(joinGatewayNotUndefined, this)) {
    //             fail = true;
    //             console.warn("The search for the responsible gateway has resulted a gateway of a different type. The Ids of the elements involved are: " + joinGatewayNotUndefined.id + " and " + this.id);
    //         }
    //     }
    //     return (!fail) ? splitGateway : undefined;
    // }


    // /** Search For Responsible */
    // private helpSearchRecursiveResponsibleSplitGateway(searchNode: SwitchableNode, innerGatewayArray: SwitchableGateway[]): SwitchableGateway | undefined {
    //     let splitGateway: SwitchableGateway | undefined = undefined;
    //     if (searchNode !== undefined)
    //         if (searchNode.isGateway()) {
    //             let searchNodeAsGateway: SwitchableGateway = searchNode as SwitchableGateway;
    //             if (searchNodeAsGateway.isJoinGateway()) {
    //                 console.warn("push Gateway to Stack with ID " + searchNodeAsGateway.id);
    //                 innerGatewayArray.push(searchNodeAsGateway);
    //             } else {
    //                 if (innerGatewayArray.length === 0) {
    //                     return searchNodeAsGateway;
    //                 } else {
    //                     let gateway: SwitchableGateway = innerGatewayArray.pop() as SwitchableGateway;
    //                     console.warn("Pop Gateway from Stack with ID " + gateway.id);
    //                 }
    //             }
    //             searchNodeAsGateway.predecessors.forEach(predecessor => {
    //                 console.log("start helpSearchRecursiveResponsibleSplitGateway by " + searchNodeAsGateway.id + " with id:" + predecessor.id + "   Array length => " + innerGatewayArray.length);
    //                 if (splitGateway === undefined) splitGateway = this.helpSearchRecursiveResponsibleSplitGateway(predecessor, innerGatewayArray);
    //             });
    //         } else {
    //             searchNode.predecessors.forEach(predecessor => {
    //                 console.log("start helpSearchRecursiveResponsibleSplitGateway by " + searchNode.id + " with id:" + predecessor.id + "   Array length => " + innerGatewayArray.length);
    //                 if (splitGateway === undefined) splitGateway = this.helpSearchRecursiveResponsibleSplitGateway(predecessor, innerGatewayArray);
    //             });
    //         }
    //     if (splitGateway !== undefined) console.log("Search get " + (splitGateway as SwitchableGateway).id + " ");
    //     return splitGateway;
    // } 








}
