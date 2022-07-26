import { matchesPattern } from '@babel/types';
import { Block } from './Block';
import { DummyNode, LeveledGraph, LNode } from './LeveledGraph';
import { SimpleEdge, SimpleGraph } from './SimpleGraph';

export class Sugiyama {
    getLeveledGraph(): LeveledGraph {
        return this.leveled;
    }
    getAcycGraph(): SimpleGraph {
        return this.acyc;
    }
    getResult() {
        this.sugiyamaFramework();
        return this.getLeveledGraph();
    }
    private sugiyamaFramework() {
        /**
         * The following steps of the Sugiyama Framework
         * are explained by Philipp Kindermann in his video serie:
         * https://www.youtube.com/watch?v=Z0RGCWxvCxA
         */
        this.makeAcyclic();
        this.leveling();
        this.addDummies();
        this.minimizeCrossings();
        this.straightening()
        this.reverseReversedEdges();

        this.assignLevelAndOrderToUnleveledNodes()

    }
    assignLevelAndOrderToUnleveledNodes() {
        const remainingNodes = [...this.leveled.unleveled]
        const getFreeOrderOfLevel = (l:number)=>{
            const level = this.leveled.levels[l]
            
        }
        for (const node of remainingNodes) {
            this.leveled.setLevelOfNode(node,0)
            node.order = this.leveled.levels[0][this.leveled.levels[0].length-1].order+1
        }
    }
    straightening() {
        const block = new Block()
        block.makeAligned(this.leveled)
         }
    placeIsFree(level:number, order:number){
        for (const n of this.leveled.getAllNodes()) {
            if(n.level == level && n.order == order) return false
        }
        return true
    }
    reverseReversedEdges() {
        const revEdges = this.leveled.edges.filter((edge) => edge.reversed);
        for (const ra of revEdges) {
            this.leveled.removeEdge(ra.from.id, ra.to.id); 
            this.leveled.addEdge(ra.to.id, ra.from.id);
        }
        for (const dummy of this.leveled.getAllDummyNodes()) {
            if(dummy.edgeIsInversed){
                const from = dummy.fromId;
                const to = dummy.toId;
                dummy.toId = from;
                dummy.fromId = to;
                dummy.edgeIsInversed = false;
            }
        }
    }
   
    /**
     * changes order of nodes inside levels, inorder to minimize crossings of edges
     */
    private minimizeCrossings() {
        /**
         * A i<= 1
         * B.With a fixed linear order Li find a linear order Li+1 which minimizes crossings( Vi, Vi+1, Li,Li+1)
         * C. if i< n-1, then i<= i+1 and go to Step B. Otherwise , go to Step D.
         * D. With a fixed linear order Li+1, find a linear order Li, which minimizes crossings
         * E. if i>1, then i<= i-1 and go to Step D. Otherwise, stop
         */

        for (let i = 0; i < this.leveled.levels.length - 1; i++) {
            this.medianHeuristic(
                this.leveled.levels[i],
                this.leveled.levels[i + 1]
            );
        }
        for (let i = this.leveled.levels.length - 1; i > 0; i--) {
            this.medianHeuristic(
                this.leveled.levels[i],
                this.leveled.levels[i - 1],
                false
            );
        }
    }
    private medianHeuristic(
        fixed: LNode[],
        toBeOrderd: LNode[],
        childrenUnordered = true
    ) {
        const median = (arr: number[]) => {
            const mid = Math.floor(arr.length / 2),
                nums = [...arr].sort((a, b) => a - b);
            return arr.length % 2 !== 0
                ? nums[mid]
                : (nums[mid - 1] + nums[mid]) / 2;
        };

        for (let i = 0; i < fixed.length; i++) {
            const e = fixed[i];
            e.order = i;
        }

        for (const e of toBeOrderd) {
            if (e.parents.length == 0) e.order = 0;
            else {
                if (childrenUnordered)
                    e.order = median(e.parents.map((n) => n.order));
                else e.order = median(e.children.map((n) => n.order));
            } 
        }

        toBeOrderd.sort((a, b) => a.order - b.order);

        // incase there are nodes with same order
        for (let i = 0; i < toBeOrderd.length; i++) {
            const e = toBeOrderd[i];
            e.order = i;
        }
    }
    private og: SimpleGraph;
    private acyc: SimpleGraph = new SimpleGraph();
    private leveled: LeveledGraph = new LeveledGraph();
    constructor(
        graph: SimpleGraph,
    ) {
        this.og = graph;
    }

    /**
     * some edges are inverted (and marked as so: edge.inversed = true) to make the graph acyclical
     */
    private makeAcyclic() {
        const cyc = this.og.clone();
        this.acyc.addNodes(this.og.nodes);
        while (cyc.nodes.length > 0) {
            while (cyc.getSinks().length > 0) {
                const sink = cyc.getSinks()[0];
                this.acyc.addEdges(cyc.getInEdges(sink.id));
                cyc.removeNode(sink.id);
                cyc.removeEdges(cyc.getInEdges(sink.id));
            }

            cyc.removeIsolatedNodes();

            while (cyc.getSources().length > 0) {
                const src = cyc.getSources()[0];
                this.acyc.addEdges(cyc.getOutEdges(src.id));
                cyc.removeNode(src.id);
                cyc.removeEdges(cyc.getOutEdges(src.id));
            }

            if (cyc.nodes.length > 0) {
                const n = cyc.getNodeWithMaxDiffInOutEdges();
                this.acyc.addEdges(cyc.getOutEdges(n.id));
                cyc.removeNode(n.id);
                cyc.removeEdges(cyc.getInAndOutEdges(n.id));
            }
        }

        const remainingEdges = SimpleGraph.substractEdges(
            this.og.edges,
            this.acyc.edges
        );

        const remainingEdgesInverted =[]
        for (const a of remainingEdges) {
            remainingEdgesInverted.push(new SimpleEdge(a.to, a.from, true))
        }
        this.acyc.addEdges(remainingEdgesInverted);
    }

    /**
     * arranges nodes in levels. The level of a node is defined by the length of the longest path from a source to that node
     */
    private leveling() {
        this.leveled.import(this.acyc);
        for (const source of this.leveled.getSources()) {
            this.leveled.setLevelOfNode(source,0)
        }
        for (const sink of this.leveled.getSinks()) {
            this.leveled.setLevelOfNode(sink, this.maxLevelOfParents(sink) + 1);

        }
    }
    private maxLevelOfParents(n: LNode) {
        let max = -1;
        const parents = n.parents;
        for (const pn of parents) {
            if (pn.level == -1) {
                this.leveled.setLevelOfNode(pn, this.maxLevelOfParents(pn) + 1);
            }
            if (pn.level > max) {
                max = pn.level;
            }
            
        }
        return max;
    }

    private addDummies() {
        for (const edge of this.leveled.edges) {
            let levelSpan = edge.to.level - edge.from.level;
            if (levelSpan > 1) {
                // split edge so that level span equals 1
                const edgeIsInversed = edge.reversed;
                this.leveled.removeEdge(edge.from.id, edge.to.id);
                let prev = edge.from.id;
                for (let i = 1; i < levelSpan; i++) {
                    const dummyId = edge.from.id + '-' + edge.to.id + 'd' + i;
                    const level = edge.from.level + i;
                    this.leveled.levels[level].push(
                        new DummyNode(
                            dummyId,
                            edge.from.id,
                            edge.to.id,
                            edgeIsInversed,
                            level
                        )
                    );
                    this.leveled.addEdge(prev, dummyId, edgeIsInversed);
                    prev = dummyId;
                }
                this.leveled.addEdge(prev, edge.to.id, edgeIsInversed);
            }
            
        }
    }
}
