import { Utility } from "../Utils/Utility";
import { LeveledGraph, LNode } from "./LeveledGraph";

export class Block {
    constructor() {
    }

    makeAligned(lgraph:LeveledGraph){
        const lg = lgraph
        const nodeCount = lg.getAllNodes().length
        this.setGravityTo(10,lg)
        this.makeLines(lg)
    }
    makeLines(lg: LeveledGraph) {
        let lineSet = new LineSet()
        let shrinkingSet = [...lg.getAllNodes()]

        let counter = 0
        while(shrinkingSet.length > 0 && counter < 3){
            counter++
            console.log("going through ")
            console.log(lineSet)
            const uppestNode = this.getNodeWithMinimalOrder(shrinkingSet)
            const line = new Line()
            line.order = lineSet.getMaximalOrder() + 1
            line.addNode(uppestNode)
    
            let next = uppestNode
            while(next != undefined){
                line.addNode(next)
                next =Utility.cutSet(next.parents, shrinkingSet).sort((a,b)=> a.order - b.order)[0]
            }
    
            next = Utility.cutSet(uppestNode.children, shrinkingSet).sort((a,b)=> a.order - b.order)[0]
            while(next != undefined){
                line.addNode(next)
                next =Utility.cutSet(next.children, shrinkingSet).sort((a,b)=> a.order - b.order)[0]
            }
            line.straighten()
            lineSet.addLine(line)
            shrinkingSet = Utility.substractArray(shrinkingSet, line.nodes)
            
        }

    }
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
    private lines: Line[] =[]
    addLine(line:Line){
        this.lines.push(line)
    }
    getMaximalOrder(){
        let max = -1
        for (const line of this.lines) {
            if(line.order> max) max = line.order
        }
        return max
    }
}
class Line{
        straighten() {
            for (const n of this.nodes) {
                n.order = this.order
            }
        }
        addNode(node: LNode) {
            this.nodes.push(node)
        }
        nodes: LNode[] =[]
        order = -1

}