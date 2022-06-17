import { BEdge } from "./BEdge";
import { BNode } from "./BNode";

export class BGraph<E extends BEdge, N extends BNode>{
    private _edges: E[] = [];
    public get edges(): E[] {
        return this._edges;
    }
    public set edges(value: E[]) {
        this._edges = value;
    }
    private _nodes: N[] = [];
    public get nodes(): N[] {
        return this._nodes;
    }
    public set nodes(value: N[]) {
        this._nodes = value;
    }
}