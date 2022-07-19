import { Utility } from "../Utils/Utility";
import { LeveledGraph, LNode } from "./LeveledGraph";

export class Block {
    constructor() {
    }

    makeAligned(lgraph:LeveledGraph){
        const lg = lgraph
        const nodeCount = lg.getAllNodes().length
        this.setGravityTo(10,lg)
        const lineset = this.makeLines(lg)
        this.moveLinesClosest(lineset)
    }
    moveLinesClosest(lineSet: LineSet) {
        const lines = lineSet.lines
        lines.sort((a,b) => a.order - b.order)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const allOtherLines = Utility.substractArray(lines, [line])
            const nodesOfOtherLines = LineSet.nodesOfLines(allOtherLines)
            for (let j = line.order-1; j > 0; j--) {
                let touchingOtherNodes = false
                for (const n of line.nodes) {
                    const newOrder = j
                }
                if(!touchingOtherNodes){
                    //
                }
            }
        }
    }
    private makeLines(lg: LeveledGraph) {
        let lineSet = new LineSet()
        let shrinkingSet = [...lg.getAllNodes()]

        let counter = 0
        let uppestNode = this.getNodeWithMinimalOrder(shrinkingSet)
        while(shrinkingSet.length > 0 && counter < 9){
            counter++
            console.log("going through ")
            console.log(lineSet)
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

            const nodesAbove: LNode[] = this.nodesAboveLine(line,shrinkingSet)
            console.log(nodesAbove)
            if (nodesAbove.length == 0){
                line.straighten()
                lineSet.addLine(line)
                shrinkingSet = Utility.substractArray(shrinkingSet, line.nodes)
                if( shrinkingSet.length>0)
                    uppestNode = this.getNodeWithMinimalOrder(shrinkingSet)
            }else{
                uppestNode = nodesAbove[0]
            }
            
            
        }

        return lineSet
    }
    private nodesAboveLine(line: Line, shrinkingSet: LNode[]): LNode[] {
        const nodesAbove = []
        for (const n of line.nodes) {
            const nodesOfLevel = shrinkingSet.filter(nn => nn.level == n.level)
            for (const nn of nodesOfLevel) {
                if(nn.order< n.order) nodesAbove.push(nn)
            }
        }
        return nodesAbove
    }
    private getNodeWithMinimalOrder(set: LNode[]) {
        const sortedByOrder = set.sort((a,b)=> (a.order  -b.order ))
        const minimalOrder = sortedByOrder[0].order
        const allNodesWithThatOrder = set.filter((n)=> n.order == minimalOrder)
        const sortedByLevel = allNodesWithThatOrder.sort((a,b)=> ((a.level) -(b.level)))
        const minimalOrderThenMinimalLevel = sortedByLevel[0]
        return minimalOrderThenMinimalLevel
    }
    private setGravityTo(order: number, lg: LeveledGraph) {
        for (const node of lg.getAllNodes()) {
            node.order = order- lg.levelSize(node.level)+ node.order
        }
    }
}
class LineSet{
    static nodesOfLines(lines: Line[]) {
        let nodes:LNode[] = []
        for (const line of lines) {
            nodes = nodes.concat(line.nodes)
        }
        return nodes
    }
    private _lines: Line[] = [];
    public get lines(): Line[] {
        return this._lines;
    }

    addLine(line:Line){
        this._lines.push(line)
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