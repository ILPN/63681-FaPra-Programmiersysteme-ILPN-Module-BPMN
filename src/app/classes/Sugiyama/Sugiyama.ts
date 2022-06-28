import { DummyNode, LeveledGraph, LNode } from './LeveledGraph';
import { SimpleArc, SimpleGraph } from './SimpleGraph';

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
        this.alignNodesOfArc()
        this.reverseReversedArcs();

    }
    alignNodesOfArc() {
        //@Marcel: here all arcs still point in one direction, the graph is still acyclical, every arc spans only over one level
        // placeisFree(level,order) might be usefull
        const leveledGraph = this.leveled

        for (const dn of this.leveled.getAllDummyNodes()) {
           // dn.order = dn.order+1 // @Marcel: just so you see what happens when you do that
        }
    }
    placeIsFree(level:number, order:number){
        for (const n of this.leveled.getAllNodes()) {
            if(n.level == level && n.order == order) return false
        }
        return true
    }
    reverseReversedArcs() {
        const revArcs = this.leveled.arcs.filter((arc) => arc.reversed);
        for (const ra of revArcs) {
            this.leveled.removeArc(ra.from.id, ra.to.id); 
            this.leveled.addArc(ra.to.id, ra.from.id);
        }
        for (const dummy of this.leveled.getAllDummyNodes()) {
            if(dummy.arcIsInversed){
                const from = dummy.fromId;
                const to = dummy.toId;
                dummy.toId = from;
                dummy.fromId = to;
                dummy.arcIsInversed = false;
            }
        }
    }
   
    /**
     * changes order of nodes inside levels, inorder to minimize crossings of arcs
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
     * some arcs are inverted (and marked as so: arc.inversed = true) to make the graph acyclical
     */
    private makeAcyclic() {
        const cyc = this.og.clone();
        this.acyc.addNodes(this.og.nodes);
        while (cyc.nodes.length > 0) {
            while (cyc.getSinks().length > 0) {
                const sink = cyc.getSinks()[0];
                this.acyc.addArcs(cyc.getInArcs(sink.id));
                cyc.removeNode(sink.id);
                cyc.removeArcs(cyc.getInArcs(sink.id));
            }

            cyc.removeIsolatedNodes();

            while (cyc.getSources().length > 0) {
                const src = cyc.getSources()[0];
                this.acyc.addArcs(cyc.getOutArcs(src.id));
                cyc.removeNode(src.id);
                cyc.removeArcs(cyc.getOutArcs(src.id));
            }

            if (cyc.nodes.length > 0) {
                const n = cyc.getNodeWithMaxDiffInOutArcs();
                this.acyc.addArcs(cyc.getOutArcs(n.id));
                cyc.removeNode(n.id);
                cyc.removeArcs(cyc.getInOutArcs(n.id));
            }
        }

        const remainingArcs = SimpleGraph.substractArcs(
            this.og.arcs,
            this.acyc.arcs
        );

        const remainingArcsInverted =[]
        for (const a of remainingArcs) {
            remainingArcsInverted.push(new SimpleArc(a.to, a.from, true))
        }
        this.acyc.addArcs(remainingArcsInverted);
    }

    /**
     * arranges nodes in levels. The level of a node is defined by the length of the longest path from a source to that node
     */
    private leveling() {
        this.leveled.import(this.acyc);
        for (const source of this.leveled.getSources()) {
            source.level = 0
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
        for (const a of this.leveled.arcs) {
            let levelSpan = a.to.level - a.from.level;
            if (levelSpan > 1) {
                // split arc so that level span equals 1
                const arcIsInversed = a.reversed;
                this.leveled.removeArc(a.from.id, a.to.id);
                let prev = a.from.id;
                for (let i = 1; i < levelSpan; i++) {
                    const dummyId = a.from.id + '-' + a.to.id + 'd' + i;
                    const level = a.from.level + i;
                    this.leveled.levels[level].push(
                        new DummyNode(
                            dummyId,
                            a.from.id,
                            a.to.id,
                            arcIsInversed,
                            level
                        )
                    );
                    this.leveled.addArc(prev, dummyId, arcIsInversed);
                    prev = dummyId;
                }
                this.leveled.addArc(prev, a.to.id, arcIsInversed);
            }
            
        }
    }
}
