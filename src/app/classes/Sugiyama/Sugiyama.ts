import { matchesPattern } from '@babel/types';
import { Block } from './Block';
import { DummyNode, TableGraph, LNode } from './TableGraph';
import { SimpleEdge, SimpleGraph } from './SimpleGraph';

export class Sugiyama {
    getTableGraph(): TableGraph {
        return this.table;
    }
    getAcycGraph(): SimpleGraph {
        return this.acyc;
    }
    getResult() {
        this.sugiyamaFramework();
        return this.getTableGraph();
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

        const block = new Block(this.table)
        this.table = block.alignNodes()

        this.reverseReversedEdges();
       // this.addCorner();
        this.assignColumnAndRowToNodesNotInTable()

    }

    // addCorner(): void {
    //     for (const edge of this.acyc.edges) { 
    //         edge.
    //     }
    // }

    assignColumnAndRowToNodesNotInTable() {
        const remainingNodes = [...this.table.notInTable]
        for (const node of remainingNodes) {
            const lowestRow = this.table.columns[0].map(n => n.row).sort((a, b) => b - a)[0];
            console.log(lowestRow)
            node.row = lowestRow + 1
            this.table.setColumnOfNode(node, 0)

        }
    }
    reverseReversedEdges() {
        const revEdges = this.table.edges.filter((edge) => edge.reversed);
        for (const ra of revEdges) {
            this.table.removeEdge(ra.from.id, ra.to.id);
            this.table.addEdge(ra.to.id, ra.from.id);
        }
        for (const dummy of this.table.getAllDummyNodes()) {
            if (dummy.edgeIsInversed) {
                const from = dummy.fromId;
                const to = dummy.toId;
                dummy.toId = from;
                dummy.fromId = to;
                dummy.edgeIsInversed = false;
            }
        }
    }

    /**
     * changes order of nodes inside columns, inorder to minimize crossings of edges
     */
    private minimizeCrossings() {
        /**
         * A i<= 1
         * B.With a fixed linear order Li find a linear order Li+1 which minimizes crossings( Vi, Vi+1, Li,Li+1)
         * C. if i< n-1, then i<= i+1 and go to Step B. Otherwise , go to Step D.
         * D. With a fixed linear order Li+1, find a linear order Li, which minimizes crossings
         * E. if i>1, then i<= i-1 and go to Step D. Otherwise, stop
         */

        for (let i = 0; i < this.table.columns.length - 1; i++) {
            this.medianHeuristic(
                this.table.columns[i],
                this.table.columns[i + 1]
            );
        }
        for (let i = this.table.columns.length - 1; i > 0; i--) {
            this.medianHeuristic(
                this.table.columns[i],
                this.table.columns[i - 1],
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
            e.row = i;
        }

        for (const e of toBeOrderd) {
            if (e.parents.length == 0) e.row = 0;
            else {
                if (childrenUnordered)
                    e.row = median(e.parents.map((n) => n.row));
                else e.row = median(e.children.map((n) => n.row));
            }
        }

        toBeOrderd.sort((a, b) => a.row - b.row);

        // incase there are nodes with same order
        for (let i = 0; i < toBeOrderd.length; i++) {
            const e = toBeOrderd[i];
            e.row = i;
        }
    }
    private og: SimpleGraph;
    private acyc: SimpleGraph = new SimpleGraph();
    private table: TableGraph = new TableGraph();
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

        const remainingEdgesInverted = []
        for (const a of remainingEdges) {
            remainingEdgesInverted.push(new SimpleEdge(a.to, a.from, true))
        }
        this.acyc.addEdges(remainingEdgesInverted);
    }

    /**
     * arranges nodes in columns. The column of a node is defined by the length of the longest path from a source to that node
     */
    private leveling() {
        this.table.import(this.acyc);
        for (const source of this.table.getSources()) {
            this.table.setColumnOfNode(source, 0)
        }
        for (const sink of this.table.getSinks()) {
            this.table.setColumnOfNode(sink, this.maxColumnOfParents(sink) + 1);

        }
    }
    private maxColumnOfParents(n: LNode) {
        let max = -1;
        const parents = n.parents;
        for (const pn of parents) {
            if (pn.column == -1) {
                this.table.setColumnOfNode(pn, this.maxColumnOfParents(pn) + 1);
            }
            if (pn.column > max) {
                max = pn.column;
            }

        }
        return max;
    }

    private addDummies() {
        for (const edge of this.table.edges) {
            let columnSpan = edge.to.column - edge.from.column;
            if (columnSpan > 1) {
                // split edge so that columnSpan equals 1
                const edgeIsInversed = edge.reversed;
                this.table.removeEdge(edge.from.id, edge.to.id);
                let prev = edge.from.id;
                for (let i = 1; i < columnSpan; i++) {
                    const dummyId = edge.from.id + '-' + edge.to.id + 'd' + i;
                    const column = edge.from.column + i;
                    this.table.columns[column].push(
                        new DummyNode(
                            dummyId,
                            edge.from.id,
                            edge.to.id,
                            edgeIsInversed,
                            column
                        )
                    );
                    this.table.addEdge(prev, dummyId, edgeIsInversed);
                    prev = dummyId;
                }
                this.table.addEdge(prev, edge.to.id, edgeIsInversed);
            }

        }
    }
}
