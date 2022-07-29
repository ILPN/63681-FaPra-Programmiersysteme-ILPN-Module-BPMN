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


export class BpmnUtils {


    public static hasInEdges(node: BpmnNode): boolean {
        return this.countInEdges(node) > 0;
    }

    public static hasNoInEdges(node: BpmnNode): boolean {
        return !this.hasInEdges(node);
    }

    public static hasOnlyOneInEdge(node: BpmnNode): boolean {
        return this.countInEdges(node) === 1;
    }

    public static hasMultipleInEdges(node: BpmnNode): boolean {
        return this.countInEdges(node) > 1;
    }

    public static hasOutEdges(node: BpmnNode): boolean {
        return this.countOutEdges(node) > 0;
    }

    public static hasNoOutEdges(node: BpmnNode): boolean {
        return !this.hasOutEdges(node);
    }

    public static hasOnlyOneOutEdge(node: BpmnNode): boolean {
        return this.countOutEdges(node) === 1;
    }

    public static hasMultipleOutEdges(node: BpmnNode): boolean {
        return this.countOutEdges(node) > 1;
    }


    /** Returns the number of incoming edges  */
    public static countInEdges(node: BpmnNode): number {
        return node.inEdges.length
    }
    /** Returns the number of outgoing edges  */
    public static countOutEdges(node: BpmnNode): number {
        return node.outEdges.length
    }

    public static getStartEvents(nodes: BpmnNode[]): BpmnEventStart[] {
        return nodes.filter(node => BpmnUtils.isStartEvent(node)).map(node => node as BpmnEventStart)
    }

    public static getEndEvents(nodes: BpmnNode[]): BpmnEventEnd[] {
        return nodes.filter(node => BpmnUtils.isEndEvent(node)).map(node => node as BpmnEventEnd)
    }

    public static getGateways(nodes: BpmnNode[]): BpmnGateway[] {
        return nodes.filter(node => BpmnUtils.isGateway(node)).map(node => node as BpmnGateway)
    }

    public static getIntermedEvents(nodes: BpmnNode[]): BpmnEventIntermediate[] {
        return nodes.filter(node => BpmnUtils.isIntermediateEvent(node)).map(node => node as BpmnEventIntermediate)
    }

    public static getTasks(nodes: BpmnNode[]): BpmnTask[] {
        return nodes.filter(node => BpmnUtils.isTask(node)).map(node => node as BpmnTask)
    }

    public static hasNoMatchingGateway(node: BpmnGateway): boolean {
        return true
    }

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


    public static isSplitAnd(node: BpmnNode): boolean {
        return node instanceof BpmnGatewaySplitAnd
    }

    public static isJoinAnd(node: BpmnNode): boolean {
        return node instanceof BpmnGatewayJoinAnd
    }

    public static isSplitXor(node: BpmnNode): boolean {
        return node instanceof BpmnGatewaySplitXor
    }

    public static isJoinXor(node: BpmnNode): boolean {
        return node instanceof BpmnGatewayJoinXor
    }

    public static isSplitOr(node: BpmnNode): boolean {
        return node instanceof BpmnGatewaySplitOr
    }

    public static isJoinOr(node: BpmnNode): boolean {
        return node instanceof BpmnGatewayJoinOr
    }

    public static next(node: BpmnNode): BpmnNode {
        return node.outEdges[0].to
    }
    public static before(node: BpmnNode): BpmnNode {
        return node.inEdges[0].from
    }

    public static getCorrespondingJoin(gateway: BpmnGateway): BpmnGateway | null {

        if (this.isSplitAnd(gateway))
            return this.getCorrespondingAndJoin(gateway)

        if (this.isSplitOr(gateway))
            return this.getCorrespondingOrJoin(gateway)

        if (this.isSplitXor(gateway))
            return this.getCorrespondingXorJoin(gateway)

        return null
    }

    public static getCorrespondingAndJoin(node: BpmnNode): BpmnGatewayJoinAnd | null {
        while (this.hasOutEdges(node)) {
            node = this.next(node);

            if (this.isJoinAnd(node))
                return node as BpmnGatewayJoinAnd;

            //nested AND gateway
            if (this.isSplitAnd(node))
                node = this.getCorrespondingAndJoin(node)!;
        }

        return null;
    }

    public static getCorrespondingOrJoin(node: BpmnNode): BpmnGatewayJoinOr | null {
        while (this.hasOutEdges(node)) {
            node = this.next(node);

            if (this.isJoinOr(node))
                return node as BpmnGatewayJoinOr;

            //nested OR gateway
            if (this.isSplitOr(node))
                node = this.getCorrespondingOrJoin(node)!;
        }

        return null;
    }

    public static getCorrespondingXorJoin(node: BpmnNode): BpmnGatewayJoinXor | null {
        while (this.hasOutEdges(node)) {
            node = this.next(node);

            if (this.isJoinXor(node))
                return node as BpmnGatewayJoinXor;

            //nested XOR gateway
            if (this.isSplitXor(node))
                node = this.getCorrespondingXorJoin(node)!;
        }

        return null;
    }




    public static splitJoinSameType(split: BpmnGateway, join: BpmnGateway) {
        let orMatch = this.isSplitOr(split) && this.isJoinOr(join)
        let andMatch = this.isSplitAnd(split) && this.isJoinAnd(join)
        let xorMatch = this.isSplitXor(split) && this.isJoinXor(join)


        return orMatch || andMatch || xorMatch
    }

}
