import { Injectable } from '@angular/core';
import { BpmnGraph } from '../classes/Basic/Bpmn/BpmnGraph';
import { SnapElement } from '../classes/Basic/Drag/SnapElements/SnapElement';
import { SnapX } from '../classes/Basic/Drag/SnapElements/SnapX';
import { LayeredGraph, LNode } from '../classes/Sugiyama/LayeredGraph';
import { SimpleGraph } from '../classes/Sugiyama/SimpleGraph';
import { Sugiyama } from '../classes/Sugiyama/Sugiyama';
import { Vector } from '../classes/Utils/Vector';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    getSnapsFor(id: string):SnapElement[] {
        //if(this.sugiResult == undefined)return []
        return[]
        
    }

    initalLayoutHasBeenDone = false;
    private width: number = 0
    private height:number = 0

    private spacingXAxis = 150
    private spacingYAxis= 100
    private padding = new Vector(100,100)
    public setViewBox(drawingArea:SVGElement){
        drawingArea.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`)
    }

    public layout(bpmnGraph: BpmnGraph, drawingArea:SVGElement): void {
        this.getSugiyamaResult(bpmnGraph);

         this.width = drawingArea.clientWidth;
         this.height = drawingArea.clientHeight;

         this.getGraphDimensions()
         this.scaleWidthAndHeightIfGraphToBig(drawingArea)
        this.setCoordinates(bpmnGraph)

        this.initalLayoutHasBeenDone = true
    }
    scaleWidthAndHeightIfGraphToBig(drawingArea:SVGElement) {
        const xRatio = (this._graphDimensions!.x+ 2* this.padding.x) / this.width
        const yRatio = (this._graphDimensions!.y+ 2* this.padding.y) / this.height
        const scalingFactor = (xRatio>yRatio)? xRatio:yRatio
        if(scalingFactor> 1){
            this.width = this.width* scalingFactor
            this.height = this.height* scalingFactor   
        }
        
    }
    setCoordinates(bpmnGraph: BpmnGraph) {
        for (const bpmnNode of bpmnGraph.nodes) {
            const ln = this.sugiResult!.getNode(bpmnNode.id)
            bpmnNode.setPos(this.getRealPosForNode(ln!))

            const inEdges = bpmnGraph.edges.filter(e => e.to == bpmnNode)
            for (const inEdge of inEdges) {
                inEdge.clearCorners()
                inEdge.setEndPos(bpmnNode.getPos().x, bpmnNode.getPos().y)
            }
            const outEdges = bpmnGraph.edges.filter(e => e.from == bpmnNode)
            for (const outEdge of outEdges) {
                outEdge.clearCorners()
                outEdge.setStartPos(bpmnNode.getPos().x, bpmnNode.getPos().y)
            } 
        }
        //add Dumynodes as edgecorners
        
        console.log(this.sugiResult!.getAllDummys())
        for (const edge of bpmnGraph.edges) {
            const dNodes = this.sugiResult!.getSortedDummysForEdge(edge.fromId,edge.toId)
            for (const d of dNodes) {
                edge.addCorner(this.getRealPosForNode(d))
            }
        }
    }

    private _graphDimensions: Vector | undefined;
    public getGraphDimensions(): Vector  {
        if(this._graphDimensions
             != undefined) return this._graphDimensions

        let biggestX = 0
        let biggestY = 0
        for (const n of this.sugiResult!.getAllNodes()) {
            const pos = this.getRawPosForNode(n)
            if(pos.x> biggestX) biggestX = pos.x
            if(pos.y> biggestY) biggestY = pos.y
        }
        this._graphDimensions = new Vector(biggestX,biggestY)
        return  this._graphDimensions
    }
    private getRawPosForNode(ln: LNode): Vector {
        return new Vector(ln.layer*this.spacingXAxis,ln.order * this.spacingYAxis)
    }
    private getRealPosForNode(ln: LNode): Vector {
        //centering
        const wh = new Vector(this.width, this.height)
        return this.getRawPosForNode(ln).plus(wh.half()).minus(this._graphDimensions!.half())
    }

     sugiResult: LayeredGraph| undefined
    getSugiyamaResult(bpmnGraph:BpmnGraph):Sugiyama{
        const sugi = new Sugiyama(SimpleGraph.convert(bpmnGraph))
        const result :LayeredGraph = sugi.getResult()
        this.sugiResult = result
        return sugi
      }
}
