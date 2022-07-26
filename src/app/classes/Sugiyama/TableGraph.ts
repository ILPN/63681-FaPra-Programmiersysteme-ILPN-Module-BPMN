import { SimpleGraph } from "./SimpleGraph";

export class TableGraph {
  clone(): TableGraph {
    const clone = new TableGraph()
    for (const node of this.notInTable) {
      clone.notInTable.push(node.clone())
    }
    for (const column of this.columns) {
      const clonedColumn = []
      for (const node of column) {
        clonedColumn.push(node.clone())
      }
      clone.columns.push(clonedColumn)
    }
    for (const edge of this.edges) {
      clone.edges.push(edge.clone())
    }
    return clone
  }
  columnSize(column: number) {
    const l = this.columns[column]
    if(l == undefined) return 0
    return l.length
    }
  public notInTable: LNode[]=[];
  public columns: LNode[][] = [[]];
  public edges: LEdge[] = [];
  getSortedDummysForEdge(from: string, to: string) {
    const dummys = this.getAllDummyNodes().filter(dn => dn.fromId == from && dn.toId == to)

    const edgeAscending = ()=> (this.getNode(from)!.column< this.getNode(to)!.column)

    return dummys.sort((a,b) => edgeAscending()? a.column-b.column: b.column - a.column)
  }
  getEdge(e: LEdge) :LEdge {
      const edge = this.edges.find(ar=> ar == e)
      if (edge == undefined) throw Error("Edge not found")
      return edge
  }
  setColumnOfNode(n: LNode, l: number) {
    n.column = l
    this.notInTable = this.notInTable.filter(nn => n.id != nn.id);
    for (const [i,column] of this.columns.entries()) {
      this.columns[i] = this.columns[i].filter(nn => n.id != nn.id);
    }
    if(this.columns[l]== undefined) this.columns[l] = []
    this.columns[l].push(n)
  }
  getSources() {
    return this.getAllNodes().filter(n => n.parents.length == 0 && n.children.length >=1)
  }
  getSinks() {
    return this.getAllNodes().filter(n => n.children.length == 0 && n.parents.length >=1)
  }
  import(acyc: SimpleGraph) {
    this.notInTable = []
      acyc.nodes.forEach(sn => {
        this.notInTable.push(new LNode(sn.id))
      });
      acyc.edges.forEach(sa => {
        this.addEdge(sa.from,sa.to, sa.inversed)
      });
  }
  addEdge(from: string, to: string, reversed = false) {
    const nFrom = this.getNode(from)
    const nTo = this.getNode(to)

    if(nFrom === undefined || nTo=== undefined){
      //console.log("addEdge: Error: Node not found")
      return
    }
    nFrom.children.push(nTo)
    nTo.parents.push(nFrom)
    this.edges.push(new LEdge(nFrom,nTo, reversed))
  }
  removeEdge(from: string, to: string) {
    const nFrom = this.getNode(from)
    const nTo = this.getNode(to)
    if(nFrom === undefined || nTo=== undefined){
      //console.log("removeEdge: Error: Node not found")
      return
    }
   nFrom.children = nFrom.children.filter(child => child.id != nTo.id)
    nTo.parents = nTo.parents.filter(parent => parent.id != nFrom.id)
    this.edges = this.edges.filter(edge => !(edge.from.id == from && edge.to.id == to))
  }

  getNode(id: string) {
    return this.getAllNodes().find(n=> n.id == id)
  }
  getAllNodes() {
    let allNodes:LNode[] = this.notInTable
    this.columns.forEach(arr => {
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
}
export class LNode{
  clone(): LNode {
    const clone = new LNode(this.id)
    clone._column = this.column.valueOf()
    clone._row = this._row.valueOf()
    return clone
  }
  private readonly _id: string
    public get id(): string {
        return this._id
    }
  protected _column = -1;
  public get column() {
    return this._column;
  }
  public set column(value) {
    this._column = value;
  }
  protected _row = 0;
  public get row() {
    return this._row;
  }
  public set row(value) {
    this._row = value;
  }
  constructor(id: string, column?: number) {
    this._id = id;
    if(column != undefined) this._column = column

  }

  protected _parents: LNode[] = [];
    public get parents(): LNode[] {
        return this._parents;
    }
    public set parents(value: LNode[]) {
        this._parents = value;
    }
    protected _children: LNode[] = [];
    public get children(): LNode[] {
        return this._children;
    }
    public set children(value: LNode[]) {
        this._children = value;
    }
}

export class LEdge {
  clone(): LEdge {
    const clone = new LEdge(this._from,this._to,this.reversed)
    return clone
  }
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
  override clone(): LNode {
    const clone = new DummyNode(this.id,this.fromId,this.toId,this.edgeIsInversed)
    clone._column = this.column.valueOf()
    clone._row = this._row.valueOf()
    return clone
  }
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


  private _edgeIsInversed: boolean;
  public get edgeIsInversed(): boolean {
    return this._edgeIsInversed;
  }
  public set edgeIsInversed(value: boolean) {
    this._edgeIsInversed = value;
  }
  constructor(id: string, from:string, to:string,edgeIsInversed:boolean, column?: number, ){
    super(id,column)
    this._fromId = from
    this._toId = to
    this._edgeIsInversed = edgeIsInversed
  }

}
