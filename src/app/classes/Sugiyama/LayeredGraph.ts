import { SimpleGraph } from "./SimpleGraph";

export class LayeredGraph {
  getArc(a: LArc) :LArc {
      const arc = this.arcs.find(ar=> ar == a)
      if (arc == undefined) throw Error("Arc not found")
      return arc
  }
  setLevelOfNode(n: LNode, l: number) {
    n.layer = l
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i] = this.layers[i].filter(nn => n.id != nn.id);      
    }
    if(l>= this.layers.length) this.layers[l] = []
    this.layers[l].push(n)
  }
  getSources() {
    return this.getAllNodes().filter(n => n.parents.length == 0 && n.children.length >=1)
  }
  getSinks() {
    return this.getAllNodes().filter(n => n.children.length == 0 && n.parents.length >=1)
  }
  import(acyc: SimpleGraph) {
    this.layers[0]=[]
      acyc.nodes.forEach(sn => {
        this.layers[0].push(new LNode(sn.id))
      });
      acyc.arcs.forEach(sa => {
        this.addArc(sa.from,sa.to, sa.inversed)        
      });
  }
  addArc(from: string, to: string, reversed = false) {
    const nFrom = this.getNode(from)
    const nTo = this.getNode(to)

    if(nFrom === undefined || nTo=== undefined){
      console.log("addArc: Error: Node not found")
      return
    }
    nFrom.children.push(nTo)
    nTo.parents.push(nFrom)
    this.arcs.push(new LArc(nFrom,nTo, reversed))
  }
  removeArc(from: string, to: string) {
    const nFrom = this.getNode(from)
    const nTo = this.getNode(to)
    if(nFrom === undefined || nTo=== undefined){
      console.log("removeArc: Error: Node not found")
      return
    }
   nFrom.children = nFrom.children.filter(child => child.id != nTo.id)
    nTo.parents = nTo.parents.filter(parent => parent.id != nFrom.id)
    this.arcs = this.arcs.filter(arc => !(arc.from.id == from && arc.to.id == to))
  }

  getNode(id: string) {
    return this.getAllNodes().find(n=> n.id == id)
  }
  getAllNodes() {
    let allNodes:LNode[] = []
    this.layers.forEach(arr => {
      allNodes = allNodes.concat(arr)      
    });
    return allNodes
  }
  getAllNoneDummyNodes():LNode[]{
    return this.getAllNodes().filter(n => !(n instanceof DummyNode))
  }
  getAllDummys():DummyNode[]{
    const dummys: DummyNode[] = []
    for(let n of this.getAllNodes()){
      if (n instanceof DummyNode){
        dummys.push(n)
      } 
    }
    return dummys
  }
  public layers: LNode[][] = [];
  public arcs: LArc[] = [];
}
export class LNode{
  private readonly _id: string
    public get id(): string {
        return this._id
    }
  private _x: number = -1;
  public get x(): number {
    return this._x;
  }
  public set x(value: number) {
    this._x = value;
  }
  private _y: number = -1;
  public get y(): number {
    return this._y;
  }
  public set y(value: number) {
    this._y = value;
  }
  private _layer = -1;
  public get layer() {
    return this._layer;
  }
  public set layer(value) {
    this._layer = value;
  }
  private _order = 0;
  public get order() {
    return this._order;
  }
  public set order(value) {
    this._order = value;
  }
  constructor(id: string, layer?: number) {
    this._id = id;
    if(layer != undefined) this._layer = layer

  }

  private _parents: LNode[] = [];
    public get parents(): LNode[] {
        return this._parents;
    }
    public set parents(value: LNode[]) {
        this._parents = value;
    }
  private _children: LNode[] = [];
    public get children(): LNode[] {
        return this._children;
    }
    public set children(value: LNode[]) {
        this._children = value;
    }
}

export class LArc {
  private _reversed = false;
  public get reversed() {
    return this._reversed;
  }
  public set reversed(value) {
    this._reversed = value;
  }
  private _from: LNode;
  public get from(): LNode {
    return this._from;
  }
  public set from(value: LNode) {
    this._from = value;
  }
  private _to: LNode;
  public get to(): LNode {
    return this._to;
  }
  public set to(value: LNode) {
    this._to = value;
  }
  constructor(from: LNode, to: LNode, reversed = false) {
    this._from = from;
    this._to = to;
    this._reversed = reversed
  }
}
export class DummyNode extends LNode{
  private _fromId: string; 
  public get fromId(): string {
    return this._fromId;
  }
  private _toId:string
  public get toId(): string {
    return this._toId;
  }
  

  constructor(id: string, from:string, to:string, layer?: number){
    super(id,layer)
    this._fromId = from
    this._toId = to

  }

}

export class DummyGroup{
  private _fromId: string; 
  public get fromId(): string {
    return this._fromId;
  }
  
  private _toId:string
  public get toId(): string {
    return this._toId;
  }
  

  constructor(from:string, to:string){
    this._fromId = from
    this._toId = to

  }

}
