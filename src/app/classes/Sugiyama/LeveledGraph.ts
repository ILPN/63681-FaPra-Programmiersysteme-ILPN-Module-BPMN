import { SimpleGraph } from "./SimpleGraph";

export class LeveledGraph {
  getSortedDummysForEdge(from: string, to: string) {
    const dummys = this.getAllDummyNodes().filter(dn => dn.fromId == from && dn.toId == to)

    const edgeAscending = ()=> (this.getNode(from)!.level< this.getNode(to)!.level)

    return dummys.sort((a,b) => edgeAscending()? a.level-b.level: b.level - a.level)
  }
  getArc(a: LArc) :LArc {
      const arc = this.arcs.find(ar=> ar == a)
      if (arc == undefined) throw Error("Arc not found")
      return arc
  }
  setLevelOfNode(n: LNode, l: number) {
    n.level = l
    this.unleveled = this.unleveled.filter(nn => n.id != nn.id);
    for (const [i,level] of this.levels.entries()) {
      this.levels[i] = this.levels[i].filter(nn => n.id != nn.id);
    }
    if(this.levels[l]== undefined) this.levels[l] = []
    this.levels[l].push(n)
  }
  getSources() {
    return this.getAllNodes().filter(n => n.parents.length == 0 && n.children.length >=1)
  }
  getSinks() {
    return this.getAllNodes().filter(n => n.children.length == 0 && n.parents.length >=1)
  }
  import(acyc: SimpleGraph) {
    this.unleveled = []
      acyc.nodes.forEach(sn => {
        this.unleveled.push(new LNode(sn.id))
      });
      acyc.arcs.forEach(sa => {
        this.addArc(sa.from,sa.to, sa.inversed)
      });
  }
  addArc(from: string, to: string, reversed = false) {
    const nFrom = this.getNode(from)
    const nTo = this.getNode(to)

    if(nFrom === undefined || nTo=== undefined){
      //console.log("addArc: Error: Node not found")
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
      //console.log("removeArc: Error: Node not found")
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
    let allNodes:LNode[] = this.unleveled
    this.levels.forEach(arr => {
      allNodes = allNodes.concat(arr)
    });
    return allNodes
  }
  getAllNoneDummyNodes():LNode[]{
    return this.getAllNodes().filter(n => !(n instanceof DummyNode))
  }
  getAllDummyNodes():DummyNode[]{
    const dummys: DummyNode[] = []
    for(let n of this.getAllNodes()){
      if (n instanceof DummyNode){
        dummys.push(n)
      }
    }
    return dummys
  }
  public unleveled: LNode[]=[];
  public levels: LNode[][] = [[]];
  public arcs: LArc[] = [];
}
export class LNode{
  private readonly _id: string
    public get id(): string {
        return this._id
    }

    /*
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
  }*/
  private _level = -1;
  public get level() {
    return this._level;
  }
  public set level(value) {
    this._level = value;
  }
  private _order = 0;
  public get order() {
    return this._order;
  }
  public set order(value) {
    this._order = value;
  }
  constructor(id: string, level?: number) {
    this._id = id;
    if(level != undefined) this._level = level

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
  public set fromId(value: string) {
    this._fromId = value;
  }

  private _toId: string;
  public get toId(): string {
    return this._toId;
  }
  public set toId(value: string) {
    this._toId = value;
  }


  private _arcIsInversed: boolean;
  public get arcIsInversed(): boolean {
    return this._arcIsInversed;
  }
  public set arcIsInversed(value: boolean) {
    this._arcIsInversed = value;
  }
  constructor(id: string, from:string, to:string,arcIsInversed:boolean, level?: number, ){
    super(id,level)
    this._fromId = from
    this._toId = to
    this._arcIsInversed = arcIsInversed
  }

}
