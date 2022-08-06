import { BpmnGraph } from "../Basic/Bpmn/BpmnGraph"

export class SimpleGraph{
  addEdge(fromId: string, toId: string) {
    this.edges.push(new SimpleEdge(fromId, toId))
  }
    private _nodes: SimpleNode[] = []
    public get nodes(): SimpleNode[] {
        return this._nodes
    }
    public set nodes(value: SimpleNode[]) {
        this._nodes = value
    }
    private _edges: SimpleEdge[] = []
    public get edges(): SimpleEdge[] {
        return this._edges
    }
    public set edges(value: SimpleEdge[]) {
        this._edges = value
    }
    clone(): SimpleGraph {
        const clone = new SimpleGraph()
        clone._nodes = [...this.nodes]
        clone._edges = [...this._edges]
        return clone
    }
    /**
     * 
     * @returns sinks (sinks are nodes that have only incoming edges, no outgoing edges)
     */
    getSinks() {
        return this.nodes.filter(n => 
            this.getOutEdges(n.id).length == 0
            &&
            this.getInEdges(n.id).length > 0
            );
    }
    /**
     * 
     * @returns sources (sources are nodes that have only outgoing edges, no incoming edges)
     */
    getSources() {
        return this.nodes.filter(n => 
            this.getInEdges(n.id).length == 0
            &&
            this.getOutEdges(n.id).length > 0
            );
    }
    getNodeWithMaxDiffInOutEdges():SimpleNode{
        let maxNode = this.nodes[0];
        let maxDif = -10000;
        this.nodes.forEach(n => {
            const d = this.getOutEdges(n.id).length - this.getInEdges(n.id).length;
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
     static substractEdges( a1:SimpleEdge[], a2: SimpleEdge[]):SimpleEdge[]{
        return a1.filter(a => !a2.find(
            ra => a.to==ra.to && a.from == ra.from
        ));
    }
    removeIsolatedNodes() {
        this._nodes = this.nodes.filter(n=> this.getInAndOutEdges(n.id).length!=0 );
    }
    removeEdges(removedEdges: SimpleEdge[]) {
        this._edges = this._edges.filter(a => !removedEdges.find(
            ra => a.to==ra.to && a.from == ra.from
        ));
    }
    removeEdge(re: SimpleEdge) {
        const before = this._edges.length
        this._edges = this._edges.filter(a => re != a)
     }
    addEdges(newEdge:SimpleEdge[]) {
        this._edges = this._edges.concat(newEdge);
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
    getInEdges(id: string){
        return this.edges.filter( a => a.to == id)
    }
    getOutEdges(id: string){
        return this.edges.filter( a => a.from == id)
    }
    getInAndOutEdges(id: string){
        return this.edges.filter( a => a.from == id || a.to == id)
    }
   
    static convert(bpmnGraph:BpmnGraph):SimpleGraph{
        const sGraph = new SimpleGraph()
        for (const node of bpmnGraph.nodes) {
            sGraph.addNode(node.id)
        }
        for (const edge of bpmnGraph.edges) {
            sGraph.addEdge(edge.fromId,edge.toId)
        }
        return sGraph
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
export class SimpleEdge{
    constructor(public from:string, public to:string, public inversed:boolean = false){
    }
}