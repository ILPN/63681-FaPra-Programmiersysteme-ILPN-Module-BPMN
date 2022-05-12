export class SimpleGraph{
  addArc(fromId: string, toId: string) {
    this.arcs.push(new SimpleArc(fromId, toId))
  }
    addAndInvertArcs(arcs: SimpleArc[]) {
        this.addArcs( arcs.map(a =>
            new SimpleArc(a.to, a.from, true)))
    }
    private _nodes: SimpleNode[] = []
    public get nodes(): SimpleNode[] {
        return this._nodes
    }
    public set nodes(value: SimpleNode[]) {
        this._nodes = value
    }
    private _arcs: SimpleArc[] = []
    public get arcs(): SimpleArc[] {
        return this._arcs
    }
    public set arcs(value: SimpleArc[]) {
        this._arcs = value
    }
    clone(): SimpleGraph {
        const clone = new SimpleGraph()
        clone._nodes = [...this.nodes]
        clone._arcs = [...this._arcs]
        return clone
    }

    getSinks() {
        return this.nodes.filter(n => 
            this.getOutArcs(n.id).length == 0
            &&
            this.getInArcs(n.id).length > 0
            );
    }
    getSources() {
        return this.nodes.filter(n => 
            this.getInArcs(n.id).length == 0
            &&
            this.getOutArcs(n.id).length > 0
            );
    }
    getNodeWithMaxDiffInOutArcs():SimpleNode{
        let maxNode = this.nodes[0];
        let maxDif = -10000;
        this.nodes.forEach(n => {
            const d = this.getOutArcs(n.id).length - this.getInArcs(n.id).length;
            if (d> maxDif){
                maxDif = d;
                maxNode = n;
            }
        });
        return maxNode
    }
    /**
     * @param a1 
     * @param a2 
     * @returns a1 without a2
     */
     static substractArcs( a1:SimpleArc[], a2: SimpleArc[]):SimpleArc[]{
        return a1.filter(a => !a2.find(
            ra => a.to==ra.to && a.from == ra.from
        ));
    }

    removeIsolatedNodes() {
        this._nodes = this.nodes.filter(n=> this.getInOutArcs(n.id).length!=0 );
    }
    removeArcs(removedArcs: SimpleArc[]) {
        this._arcs = this._arcs.filter(a => !removedArcs.find(
            ra => a.to==ra.to && a.from == ra.from
        ));
    }
    removeArc(ra: SimpleArc) {
        const before = this._arcs.length
        this._arcs = this._arcs.filter(a => ra != a)
     }
    addArcs(newArcs:SimpleArc[]) {
        this._arcs = this._arcs.concat(newArcs);
    }

    addNode(id:string){
        if (this.nodes.find(n =>  n.id == id)) return;
        else this.nodes.push(new SimpleNode(id));
    }
    addNodes(nnodes:SimpleNode[]) {
        this._nodes = this._nodes.concat(nnodes);
    }
    removeNode(id:string){
        this._nodes = this.nodes.filter(n =>  n.id != id);
    }
    getInArcs(id: string){
        return this.arcs.filter( a => a.to == id)
    }
    getOutArcs(id: string){
        return this.arcs.filter( a => a.from == id)
    }
    getInOutArcs(id: string){
        return this.arcs.filter( a => a.from == id || a.to == id)
    }
   
}
export class SimpleNode{
    private readonly _id: string
    public get id(): string {
        return this._id
    }
    constructor(id:string){
        this._id = id
    }
}
export class SimpleArc{
    constructor(public from:string, public to:string, public inversed:boolean = false){
    }
}