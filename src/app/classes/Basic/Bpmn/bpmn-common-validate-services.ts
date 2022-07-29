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
    private startEventNodes: BpmnNode[] = [];
    private endEventNodes: BpmnNode[] = [];
    private bpmnTasks: BpmnNode[] = [];
    private intermediateEventNodes: BpmnNode[] = [];
    private gatewayNodes: BpmnNode[] = [];

    
    constructor(nodes: BpmnNode[]) {
        nodes.forEach(node => {
            if (BpmnCommonValidateServices.isTask(node)) {
                this.bpmnTasks.push(node);
            } else {
                if (BpmnCommonValidateServices.isGateway(node)) {
                    this.gatewayNodes.push(node);
                } else {
                    if (BpmnCommonValidateServices.isEvent(node)) {
                        if (BpmnCommonValidateServices.isStartEvent(node)) {
                            this.startEventNodes.push(node);
                        } else {
                            if (BpmnCommonValidateServices.isEndEvent(node)) {
                                this.endEventNodes.push(node);
                            } else {
                                if (BpmnCommonValidateServices.isIntermediateEvent(node)) {
                                    this.intermediateEventNodes.push(node);
                                }
                            }
                        }
                    }
                }
            }
        });
    }




    public validateGraph(): boolean {
    let isValide = true;
    if(!this.validateTask()) isValide = false; 
    if(!this.validateStartEventNodes()) isValide = false; 
    if(!this.validateIntermediateEventNodes()) isValide = false; 
    if(!this.validateEndEventNodes()) isValide = false; 
    if(!this.validateGateways()) isValide = false; 
    if(!isValide) console.error("Die Überprüfung des BPMN hat einen Fehler ergeben.");
    if(isValide) console.log("Die Überprüfung des BPMN hat keinen Fehler ergeben.");
    
    return isValide;
    };

    private validateTask() : boolean {
        let isValide = true;
        this.bpmnTasks.forEach(node => {
            if (!BpmnCommonValidateServices.isInputNotEmpty(node)||!BpmnCommonValidateServices.isOnlyOneInput(node)) isValide = false;
            if (!BpmnCommonValidateServices.isOutputNotEmpty(node)||!BpmnCommonValidateServices.isOnlyOneOutput(node)) isValide = false;
            if(!isValide) console.warn("Die Überprüfung von Task mit der ID: "+node.id+" hat einen Fehler ergeben.");
        });
        return isValide;
    }
    private validateStartEventNodes() : boolean {
        let isValide = true;
        if(this.startEventNodes.length < 1) isValide = false;
        if(!isValide) console.warn("Es gibt kein Start-Event");
        this.startEventNodes.forEach(node => {
            if (BpmnCommonValidateServices.isInputNotEmpty(node)|| BpmnCommonValidateServices.isOnlyOneInput(node)) isValide = false;
            if (!BpmnCommonValidateServices.isOutputNotEmpty(node)|| !BpmnCommonValidateServices.isOnlyOneOutput(node)) isValide = false;
            if(!isValide) console.warn("Die Überprüfung von einem Start Event  mit der ID: "+node.id+" hat einen Fehler ergeben.");
        });
        return isValide;
    }

    private validateIntermediateEventNodes() : boolean {
        let isValide = true;
        this.intermediateEventNodes.forEach(node => {
            if (!BpmnCommonValidateServices.isInputNotEmpty(node)||!BpmnCommonValidateServices.isOnlyOneInput(node)) isValide = false;
            if (!BpmnCommonValidateServices.isOutputNotEmpty(node)|| !BpmnCommonValidateServices.isOnlyOneOutput(node)) isValide = false;
            if(!isValide) console.warn("Die Überprüfung von einem Zwischen-Event  mit der ID: "+node.id+" hat einen Fehler ergeben.");
        });
        return isValide;
    }

    private validateEndEventNodes() : boolean {
        let isValide = true;
        if(this.endEventNodes.length < 1) isValide = false;
        if(!isValide) console.warn("Es gibt kein End-Event");
        this.endEventNodes.forEach(node => {
            if (!BpmnCommonValidateServices.isInputNotEmpty(node)||!BpmnCommonValidateServices.isOnlyOneInput(node)) isValide = false;
            if (BpmnCommonValidateServices.isOutputNotEmpty(node)|| BpmnCommonValidateServices.isOnlyOneOutput(node)) isValide = false;
            if(!isValide) console.warn("Die Überprüfung von einem End-Event  mit der ID: "+node.id+" hat einen Fehler ergeben.");
        });
        return isValide;
    }

    private validateGateways() : boolean {
        let isValide = true;
        this.gatewayNodes.forEach(node => {
            // Check Assoziationen
            if (!BpmnCommonValidateServices.isInputNotEmpty(node) && !BpmnCommonValidateServices.isOutputNotEmpty(node) &&
                ((BpmnCommonValidateServices.isGatewayJoin(node) && node.inEdges.length > 1 && node.outEdges.length === 1) ||
                (BpmnCommonValidateServices.isGatewaySplit(node) && node.inEdges.length === 1 && node.outEdges.length > 1)))
                 isValide = false;
            if(BpmnCommonValidateServices.isGatewaySplit(node)) {
                var gateway = BpmnCommonValidateServices.getCorrespondingUniversalJoin(node);
                console.log("Split Gateway "+node.id+ " dazu passendes Join Gateway: "+gateway?.id);
            } else {
                var gateway = BpmnCommonValidateServices.getCorrespondingUniversalSplit(node);
                console.log("Join Gateway "+node.id+ " dazu passendes Split Gateway: "+gateway?.id);
            }
            



            if(!isValide) console.warn("Die Überprüfung von dem Gateway mit der ID: "+node.id+" hat einen Fehler ergeben.");
        });
        return isValide;
    }


public static isInputNotEmpty(node: BpmnNode) : boolean {
        return this.countInEdge(node) !== 0;
}
public static isOnlyOneInput(node: BpmnNode) : boolean {
    return this.countInEdge(node) === 1;
}

public static isOutputNotEmpty(node: BpmnNode) : boolean {
    return this.countOutEdge(node) !== 0;
}
public static isOnlyOneOutput(node: BpmnNode) : boolean {
return this.countOutEdge(node) === 1;
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


    private static isSplitAnd(node: BpmnNode): boolean {
        return node instanceof BpmnGatewaySplitAnd
    }

    private static isJoinAnd(node: BpmnNode): boolean {
        return node instanceof BpmnGatewayJoinAnd
    }

    private static isSplitXor(node: BpmnNode): boolean {
        return node instanceof BpmnGatewaySplitXor
    }

    private static isJoinXor(node: BpmnNode): boolean {
        return node instanceof BpmnGatewayJoinXor
    }

    private static isSplitOr(node: BpmnNode): boolean {
        return node instanceof BpmnGatewaySplitOr
    }

    private static isJoinOr(node: BpmnNode): boolean {
        return node instanceof BpmnGatewayJoinOr
    }

    private static hasOutEdges(node: BpmnNode): boolean {
        return node.outEdges.length > 0;
    }

    private static hasInEdges(node: BpmnNode): boolean {
        return node.inEdges.length > 0;
    }

    private static next(node: BpmnNode): BpmnNode {
        return node.outEdges[0].to
    }
    private static before(node: BpmnNode): BpmnNode {
        return node.inEdges[0].from
    }

    static getCorrespondingJoin(node: BpmnNode): BpmnNode | null {
       // if(this.isJoinOr(node)) return this.getCorrespondingOrJoin(node);

        return this.getCorrespondingUniversalJoin(node);
    }

    static getCorrespondingOrJoin(node: BpmnNode): BpmnNode | null {
        while (this.hasOutEdges(node)) {
            node = this.next(node);

            if (this.isJoinOr(node))
                return node;

            //nested OR gateway
            if (this.isSplitOr(node))
                node = this.getCorrespondingOrJoin(node)!;
        }

        return null;
    }

    static getCorrespondingUniversalJoin(node: BpmnNode): BpmnNode | null {
        while (this.hasOutEdges(node)) {
            node = this.next(node);
            if (this.isGatewayJoin(node))
                return node;
            //nested OR gateway
            if (this.isGatewaySplit(node))
                node = this.getCorrespondingUniversalJoin(node)!;
        }
        return null;
    }

    static getCorrespondingUniversalSplit(node: BpmnNode): BpmnNode | null {
        while (this.hasInEdges(node)) {
            node = this.before(node);
            if (this.isGatewaySplit(node))
                return node;
            //nested OR gateway
            if (this.isGatewayJoin(node))
                node = this.getCorrespondingUniversalSplit(node)!;
        }
        return null;
    }






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
