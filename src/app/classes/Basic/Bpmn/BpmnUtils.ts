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

/**
 * provides various convenience methods for BpmnGraph
 */
export class BpmnUtils {

    /**
     * returns true if the specified node has at least one incoming edge
     * @param node 
     * @returns 
     */
    public static hasInEdges(node: BpmnNode): boolean {
        return this.countInEdges(node) > 0;
    }

    /**
     * returns true if the specified node has no incoming edges
     * @param node 
     * @returns 
     */
    public static hasNoInEdges(node: BpmnNode): boolean {
        return !this.hasInEdges(node);
    }

    /**
     * returns true if the specified node has exactly one incoming edge
     * @param node 
     * @returns 
     */
    public static hasOnlyOneInEdge(node: BpmnNode): boolean {
        return this.countInEdges(node) === 1;
    }

    /**
     * returns true if the specified node has more than one incoming edges
     * @param node 
     * @returns 
     */
    public static hasMultipleInEdges(node: BpmnNode): boolean {
        return this.countInEdges(node) > 1;
    }

    /**
     * returns true if the specified node has at least one outgoing edge
     * @param node 
     * @returns 
     */
    public static hasOutEdges(node: BpmnNode): boolean {
        return this.countOutEdges(node) > 0;
    }

    /**
     * returns true if the specified node has no outgoing edges
     * @param node 
     * @returns 
     */
    public static hasNoOutEdges(node: BpmnNode): boolean {
        return !this.hasOutEdges(node);
    }
    /**
     * returns true if the specified node has exactly one outgoing edge
     * @param node 
     * @returns 
     */
    public static hasOnlyOneOutEdge(node: BpmnNode): boolean {
        return this.countOutEdges(node) === 1;
    }

    /**
     * returns true if the specified node has more than one outgoing edge
     * @param node 
     * @returns 
     */
    public static hasMultipleOutEdges(node: BpmnNode): boolean {
        return this.countOutEdges(node) > 1;
    }


    /**
     * gets the number of incoming edges of the specified node
     * @param node 
     * @returns 
     */
    public static countInEdges(node: BpmnNode): number {
        return node.inEdges.length
    }

    /**
     * gets the number of outgoing edges of the specified node
     * @param node 
     * @returns 
     */
    public static countOutEdges(node: BpmnNode): number {
        return node.outEdges.length
    }
    /**
     * filters out start events from the specified list of nodes
     * @param nodes 
     * @returns start events
     */
    public static getStartEvents(nodes: BpmnNode[]): BpmnEventStart[] {
        return nodes.filter(node => BpmnUtils.isStartEvent(node)).map(node => node as BpmnEventStart)
    }

    /**
    * filters out end events from the specified list of nodes
    * @param nodes 
    * @returns end events
    */
    public static getEndEvents(nodes: BpmnNode[]): BpmnEventEnd[] {
        return nodes.filter(node => BpmnUtils.isEndEvent(node)).map(node => node as BpmnEventEnd)
    }

    /**
    * filters out gateways from the specified list of nodes
    * @param nodes 
    * @returns start events
    */
    public static getGateways(nodes: BpmnNode[]): BpmnGateway[] {
        return nodes.filter(node => BpmnUtils.isGateway(node)).map(node => node as BpmnGateway)
    }

    public static getIntermedEvents(nodes: BpmnNode[]): BpmnEventIntermediate[] {
        return nodes.filter(node => BpmnUtils.isIntermediateEvent(node)).map(node => node as BpmnEventIntermediate)
    }

    public static getTasks(nodes: BpmnNode[]): BpmnTask[] {
        return nodes.filter(node => BpmnUtils.isTask(node)).map(node => node as BpmnTask)
    }

    /**
     * checks if the specified gateway has a matching gateway,
     * for ex., if SPLIT-AND has a corresponding JOIN-AND
     * @param gateway 
     * @returns true if matching gateway found
     */
    public static hasNoMatchingGateway(gateway: BpmnGateway): boolean {
        return !this.getCorrespondingGateway(gateway)
    }

    public static isGateway(node: BpmnNode): boolean {
        return node instanceof BpmnGateway
    }


    public static isJoinGateway(node: BpmnNode): boolean {
        return this.isJoinAnd(node) || this.isJoinOr(node) || this.isJoinXor(node);
    }


    public static isSplitGateway(node: BpmnNode): boolean {
        return this.isSplitAnd(node) || this.isSplitOr(node) || this.isSplitXor(node);
    }

    public static isOrGateway(node: BpmnNode): boolean {
        return this.isSplitOr(node) || this.isJoinOr(node);
    }


    public static isXorGateway(node: BpmnNode): boolean {
        return this.isSplitXor(node) || this.isJoinXor(node);
    }


    public static isAndGateway(node: BpmnNode): boolean {
        return this.isSplitAnd(node) || this.isJoinAnd(node);
    }


    public static isTask(node: BpmnNode): boolean {
        return node instanceof BpmnTask
    }


    public static isEvent(node: BpmnNode): boolean {
        return node instanceof BpmnEvent
    }


    public static isStartEvent(node: BpmnNode): boolean {
        return node instanceof BpmnEventStart
    }


    public static isIntermediateEvent(node: BpmnNode): boolean {
        return node instanceof BpmnEventIntermediate
    }

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

    /**
     * gets successor of the specified node
     * (using an arbitrary outgoing edge if there are multiple outgoing edges)
     * @param node 
     * @returns node directly after the specified node 
     */
    public static next(node: BpmnNode): BpmnNode {
        return node.outEdges[0].to
    }

    /**
     * gets predecessor of the specified node 
     * (using an arbitrary incoming edge if there are multiple incoming edges)
     * @param node 
     * @returns node directly before the specified node 
     */
    public static before(node: BpmnNode): BpmnNode {
        return node.inEdges[0].from
    }

    /**
    * traverses the graph starting from the specified node to find the matching gateway
    * @param node node to start traversal from
    * @returns matching gateway or null if not found
    */
    public static getCorrespondingGateway(gateway: BpmnGateway): BpmnGateway | null {
        if (this.isJoinGateway(gateway))
            return this.getCorrespondingSplit(gateway)

        if (this.isSplitGateway(gateway))
            return this.getCorrespondingJoin(gateway)

        return null
    }
    /**
     * traverses the graph in reverse order to find the matching SPLIT gateway
     * @param node node to start traversal from
     * @returns preceding SPLIT gateway or null if not found
     */
    public static getCorrespondingSplit(gateway: BpmnGateway): BpmnGateway | null {

        if (this.isJoinAnd(gateway))
            return this.getCorrespondingAndSplit(gateway)

        if (this.isJoinOr(gateway))
            return this.getCorrespondingOrSplit(gateway)

        if (this.isJoinXor(gateway))
            return this.getCorrespondingXorSplit(gateway)

        return null
    }
    /**
     * traverses the graph forward to find the matching JOIN gateway
     * @param node node to start traversal from
     * @returns succeeding JOIN gateway or null if not found
     */
    public static getCorrespondingJoin(gateway: BpmnGateway): BpmnGateway | null {

        if (this.isSplitAnd(gateway))
            return this.getCorrespondingAndJoin(gateway)

        if (this.isSplitOr(gateway))
            return this.getCorrespondingOrJoin(gateway)

        if (this.isSplitXor(gateway))
            return this.getCorrespondingXorJoin(gateway)

        return null
    }
    /**
     * traverses the graph forward to find the matching AND-JOIN gateway
     * @param node node to start traversal from
     * @returns succeeding AND-JOIN gateway or null if not found
     */
    public static getCorrespondingAndJoin(node: BpmnNode): BpmnGatewayJoinAnd | null {
        if (!node)
            return null

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
    /**
     * traverses the graph forward to find the matching OR-JOIN gateway
     * @param node node to start traversal from
     * @returns succeeding OR-JOIN gateway or null if not found
     */
    public static getCorrespondingOrJoin(node: BpmnNode): BpmnGatewayJoinOr | null {
        if (!node)
            return null

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
    /**
    * traverses the graph forward to find the matching XOR-JOIN gateway
    * @param node node to start traversal from
    * @returns succeeding XOR-JOIN gateway or null if not found
    */
    public static getCorrespondingXorJoin(node: BpmnNode): BpmnGatewayJoinXor | null {
        if (!node)
            return null

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

    /**
     * traverses the graph in reverse order to find the matching AND-SPLIT gateway
     * @param node node to start traversal from
     * @returns preceding AND-SPLIT gateway or null if not found
     */
    public static getCorrespondingAndSplit(node: BpmnNode): BpmnGatewaySplitAnd | null {
        if (!node)
            return null

        while (this.hasInEdges(node)) {
            node = this.before(node);

            if (this.isSplitAnd(node))
                return node as BpmnGatewaySplitAnd;

            //nested AND gateway
            if (this.isJoinAnd(node))
                node = this.getCorrespondingAndSplit(node)!;
        }

        return null;
    }
    /**
    * traverses the graph in reverse order to find the matching OR-SPLIT gateway
    * @param node node to start traversal from
    * @returns preceding OR-SPLIT gateway or null if not found
    */
    public static getCorrespondingOrSplit(node: BpmnNode): BpmnGatewaySplitOr | null {
        if (!node)
            return null

        while (this.hasInEdges(node)) {
            node = this.before(node);

            if (this.isSplitOr(node))
                return node as BpmnGatewaySplitOr;

            //nested OR gateway
            if (this.isJoinOr(node))
                node = this.getCorrespondingOrSplit(node)!;
        }

        return null;
    }
    /**
     * traverses the graph in reverse order to find the matching XOR-SPLIT gateway
     * @param node node to start traversal from
     * @returns preceding XOR-SPLIT gateway or null if not found
     */
    public static getCorrespondingXorSplit(node: BpmnNode): BpmnGatewaySplitXor | null {
        if (!node)
            return null

        while (this.hasInEdges(node)) {
            node = this.before(node);

            if (this.isSplitXor(node))
                return node as BpmnGatewaySplitXor;

            //nested XOR gateway
            if (this.isJoinXor(node))
                node = this.getCorrespondingXorSplit(node)!;
        }

        return null;
    }

    /**
     * checks whether split and join gateway are of the same type, for ex. AND-SPLIT and AND-JOIN
     * @param split split gateway
     * @param join join gateway
     * @returns true if the gateways are of the same type
     */
    public static splitJoinSameType(split: BpmnGateway, join: BpmnGateway) {
        let orMatch = this.isSplitOr(split) && this.isJoinOr(join)
        let andMatch = this.isSplitAnd(split) && this.isJoinAnd(join)
        let xorMatch = this.isSplitXor(split) && this.isJoinXor(join)


        return orMatch || andMatch || xorMatch
    }

}
