import { LeveledGraph, LNode } from "./LeveledGraph";

export class Block {
    constructor() {
    }

    makeAligned(lgraph:LeveledGraph){
        const lg = lgraph
        const nodeCount = lg.getAllNodes().length
        this.setGravityTo(nodeCount,lg)
        this.makeLines(lg)
    }
    makeLines(lg: LeveledGraph) {
        const uppestNode = this.getNodeWithMinimalOrder(lg.getAllNodes())
    }
    /**
     * 
     * @param order
     * @param level 
     * @param set considered LNodes
     * @returns node with node.order closest to order. if there are multiple ones, the one with node.level closest to level is picked
     */
    getNodeWithMinimalOrder(set: LNode[]) {
        const sortedByOrder = [...set].sort((a,b)=> (a.order  -b.order ))
        const minimalOrder = sortedByOrder[0].order
        const allNodesWithThatOrder = set.filter((n)=> n.order == minimalOrder)
        const sortedByLevel = allNodesWithThatOrder.sort((a,b)=> ((a.level) -(b.level)))
        const minimalOrderThenMinimalLevel = sortedByLevel[0]
        return minimalOrderThenMinimalLevel
    }
    setGravityTo(order: number, lg: LeveledGraph) {
        for (const node of lg.getAllNodes()) {
            node.order = order- lg.levelSize(node.level)+ node.order
        }
    }
}
class LineSet{
    lines: Line[] =[]
}
class Line{
        nodes: LNode[] =[]
        order = -1

}