import { Utility } from "../Utils/Utility";
import { LNode, TableGraph } from "./TableGraph";

export class Block {
    private og:TableGraph
    private g: TableGraph
    constructor(tGraph:TableGraph) {
        this.og = tGraph.clone()
        this.g = tGraph
    }
    alignNodes(){
        const nodeCount = this.g.getAllNodes().length
        this.setGravityTo(nodeCount)
        const makeLinesResult = this.makeLines()
        if(makeLinesResult.loopTerminates){
            this.moveLinesClosestTogether(makeLinesResult.lineSet)
            return this.g
        }else{
            this.g = this.og
            return this.og
        }
    }
    moveLinesClosestTogether(lineSet: LineSet) {
        const lines = lineSet.lines
        lines.sort((a,b) => a.order - b.order)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const allOtherLines = Utility.substractArray(lines, [line])
            const nodesOfOtherLines = LineSet.nodesOfLines(allOtherLines)

            for (let j = line.order-1; j >= 0; j--) {
                let touchingOtherNodes = false
                for (const n of line.nodes) {
                    const rowsInColumn = nodesOfOtherLines.filter(nn => nn.column == n.column).map(nn => nn.row)
                    if(rowsInColumn.includes(j)) touchingOtherNodes = true
                }
                if(touchingOtherNodes){
                    line.order = j+1
                    line.straighten()
                    break
                }
            }
            
        }
    }
    private makeLines() {
        let lineSet = new LineSet()
        let shrinkingSet = [...this.g.getAllNodes()]

        let iterationCount = 0
        let uppestNode = this.getNodeWithMinimalOrder(shrinkingSet)
        let loopTerminates = true
        const maxIterations = this.g.getAllNodes().length +1
        while(shrinkingSet.length > 0 && iterationCount <= maxIterations){
            iterationCount++
            if(iterationCount >= maxIterations){
                loopTerminates = false
                break
            } 

            const line = new Line()
            line.order = lineSet.getMaximalOrder() + 1
            let next = uppestNode
            while(next != undefined){
                line.addNode(next)
                next =Utility.cutSet(next.parents, shrinkingSet).sort((a,b)=> a.row - b.row)[0]
            }
    
            next = Utility.cutSet(uppestNode.children, shrinkingSet).sort((a,b)=> a.row - b.row)[0]
            while(next != undefined){
                line.addNode(next)
                next =Utility.cutSet(next.children, shrinkingSet).sort((a,b)=> a.row - b.row)[0]
            }

            const nodesAbove: LNode[] = this.nodesAboveLine(line,shrinkingSet)
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

        return {lineSet:lineSet, loopTerminates:loopTerminates}
    }
    private nodesAboveLine(line: Line, shrinkingSet: LNode[]): LNode[] {
        const nodesAbove = []
        for (const n of line.nodes) {
            const nodesOfColumn = shrinkingSet.filter(nn => nn.column == n.column)
            for (const nn of nodesOfColumn) {
                if(nn.row< n.row) nodesAbove.push(nn)
            }
        }
        return nodesAbove
    }
    private getNodeWithMinimalOrder(set: LNode[]) {
        const sortedByOrder = set.sort((a,b)=> (a.row  -b.row ))
        const minimalOrder = sortedByOrder[0].row
        const allNodesWithThatOrder = set.filter((n)=> n.row == minimalOrder)
        const sortedByColumn = allNodesWithThatOrder.sort((a,b)=> ((a.column) -(b.column)))
        const minimalRowThenMinimalColumn = sortedByColumn[0]
        return minimalRowThenMinimalColumn
    }
    private setGravityTo(order: number) {
        for (const node of this.g.getAllNodes()) {
            node.row = order- this.g.columnSize(node.column)+ node.row
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
                n.row = this.order
            }
        }
        addNode(node: LNode) {
            this.nodes.push(node)
        }
        nodes: LNode[] =[]
        order = -1

}