import { DummyNode, LayeredGraph, LNode } from "./LayeredGraph";
import { SimpleGraph } from "./SimpleGraph";

export class Sugiyama{
    getLayeredGraph(): LayeredGraph {
        return this.leveled
    }
    getAcycGraph(): SimpleGraph {
        return this.acyc
    }
    getResult(){
        this.makeMagicHappen()
        return this.getLayeredGraph()
    }
    private makeMagicHappen() {
        this.makeAcyclic()
        this.leveling()
        this.addDummies()
        this.ordering()
        this.reverseReversedArcs()
        this.calculateCoordinates()
    }
    private calculateCoordinates() {
        for (let l = 0; l < this.leveled.layers.length; l++) {
            const layer = this.leveled.layers[l];
            layer.forEach(n =>{
                n.x = n.layer * this._spacingXAxis
                n.y = n.order * this._spacingYAxis
            })
            const usableHeight = this._height - 2* this._padding
            let biggestY = layer[layer.length -1].y
            if (biggestY > usableHeight){
                //to big, scale down
                const factor = usableHeight / biggestY
                layer.forEach(n=> n.y = n.y*factor)
            }
            //centering
            biggestY = layer[layer.length -1].y
            const deltaY = this._height/2 - biggestY/2
            layer.forEach(n=>n.y = n.y+deltaY)

        }
        //to big, scale down
        const usableWidth = this._width -(2* this._padding)
        let biggestX = this.leveled.layers[this.leveled.layers.length-1][0].x
        if(biggestX > usableWidth){
            const xScalingFactor = usableWidth/biggestX
            this.leveled.getAllNodes().forEach(n => n.x = n.x * xScalingFactor)
        }
        //centering
        biggestX =this.leveled.layers[this.leveled.layers.length-1][0].x
        this.leveled.getAllNodes().forEach(n=>n.x = n.x + this._width/2 - biggestX/2)

    }
    reverseReversedArcs() {
        const revArcs = this.leveled.arcs.filter(arc => arc.reversed)
        revArcs.forEach(ra => {
            this.leveled.removeArc(ra.from.id,ra.to.id)
            this.leveled.addArc(ra.to.id,ra.from.id)
        });
    }
    private ordering() {
         /**
         * A i<= 1
         * B.With a fixed linear order L1 find a linear order L1+a which minimizes crossings( Vi, Vi+1, Li,Li+1)
         * C. if i< n-1, then i<= i+1 and go to Step B. Otherwise , go to Step D.
         * D. With a fixed linear order Li+1, find a linear order Li, which minimizes crossings
         * E. if i>1, then i<= i-1 and go to Step D. Otherwise, stop
         */

         for (let i = 0; i < this.leveled.layers.length-1; i++) {
             this.medianHeuristic(this.leveled.layers[i], this.leveled.layers[i+1])
         }
         for (let i = this.leveled.layers.length-1; i > 0; i--) {
            this.medianHeuristic(this.leveled.layers[i], this.leveled.layers[i-1], false)
        }

    }
    private medianHeuristic(fixed: LNode[], toBeOrderd:LNode[], childrenUnordered = true){
        const median = (arr:number[]) => {
            const mid = Math.floor(arr.length / 2),
              nums = [...arr].sort((a, b) => a - b);
            return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
          };

        for (let i = 0; i < fixed.length; i++) {
            const e = fixed[i];
            e.order = i
        }

        toBeOrderd.forEach(e => {
            if(e.parents.length == 0) e.order = 0
            else{
                if(childrenUnordered) e.order = median(e.parents.map(n => n.order))
                else e.order = median(e.children.map(n => n.order))
            }
        });

        toBeOrderd.sort((a, b) => a.order - b.order)

        // incase there are nodes with same order
        for (let i = 0; i < toBeOrderd.length; i++) {
            const e = toBeOrderd[i];
            e.order = i
        }


    }
    private og:SimpleGraph
    private acyc: SimpleGraph = new SimpleGraph()
    private leveled: LayeredGraph = new LayeredGraph()
    private _width: number;
    public get width(): number {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;
    }
    private _height: number;
    public get height(): number {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
    }
    private _padding: number;
    public get padding(): number {
        return this._padding;
    }
    public set padding(value: number) {
        this._padding = value;
    }
    private _spacingXAxis: number;
    public get spacingXAxis(): number {
        return this._spacingXAxis;
    }
    public set spacingXAxis(value: number) {
        this._spacingXAxis = value;
    }
    private _spacingYAxis: number;
    public get spacingYAxis(): number {
        return this._spacingYAxis;
    }
    public set spacingYAxis(value: number) {
        this._spacingYAxis = value;
    }
    constructor(graph:SimpleGraph, width:number=1000, heigth:number = 500, padding = 20,spacingXAxis:number= 20, spacingYAxis:number =20 ){
        this.og = graph;
        this._width = width
        this._height = heigth
        this._padding = padding
        this._spacingXAxis = spacingXAxis
        this._spacingYAxis = spacingYAxis
    }

    private makeAcyclic() {
        const cyc = this.og.clone()
        this.acyc.addNodes(this.og.nodes)
        while(cyc.nodes.length>0){
            while (cyc.getSinks().length>0){
                const sink= cyc.getSinks()[0];
                this.acyc.addArcs(cyc.getInArcs(sink.id));
                cyc.removeNode(sink.id);
                cyc.removeArcs(cyc.getInArcs(sink.id));
            }

            cyc.removeIsolatedNodes()

            while(cyc.getSources().length>0){
                const src= cyc.getSources()[0];
                this.acyc.addArcs(cyc.getOutArcs(src.id));
                cyc.removeNode(src.id);
                cyc.removeArcs(cyc.getOutArcs(src.id));
            }

            if(cyc.nodes.length>0){
                const n = cyc.getNodeWithMaxDiffInOutArcs();
                this.acyc.addArcs(cyc.getOutArcs(n.id));
                cyc.removeNode(n.id);
                cyc.removeArcs(cyc.getInOutArcs(n.id));
            }
        }

        const remainingArcs = SimpleGraph.substractArcs(this.og.arcs,this.acyc.arcs)
        this.acyc.addAndInvertArcs(remainingArcs);
    }

    private leveling(){
        this.leveled.import(this.acyc)
        this.leveled.getSources().forEach(n=> n.layer = 0)
        this.leveled.getSinks().forEach(n => {
            this.leveled.setLevelOfNode(n, this.maxOfParents(n) + 1)
        });
    }
    private maxOfParents(n: LNode) {
        let max = -1;
        const parents = n.parents
        parents.forEach(pn =>{

            if(pn.layer == -1){
                this.leveled.setLevelOfNode(pn, this.maxOfParents(pn) + 1)
            }
            if (pn.layer > max){
                max = pn.layer
            }
        })
        return max
    }

    private addDummies() {
        this.leveled.arcs.forEach(a => {
            let levelSpan = a.to.layer - a.from.layer
            if (levelSpan > 1){
                // split arc so that level span equals 1
                const arcIsInversed = this.leveled.getArc(a).reversed
                this.leveled.removeArc(a.from.id,a.to.id)
                let prev = a.from.id
                for (let i = 1; i < levelSpan; i++) {
                    const dummyId = a.from.id+"-"+a.to.id+"d"+ i
                    const layer = a.from.layer + i
                    this.leveled.layers[layer].push( new DummyNode(dummyId, a.from.id, a.to.id,layer))
                    this.leveled.addArc(prev, dummyId,arcIsInversed)   
                    prev = dummyId                   
                }
                this.leveled.addArc(prev, a.to.id,arcIsInversed)
            }
        });
    }
}
