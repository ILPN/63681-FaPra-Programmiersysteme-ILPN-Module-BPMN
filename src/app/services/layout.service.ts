import { Injectable } from '@angular/core';
import { BpmnGraph } from '../classes/Basic/Bpmn/BpmnGraph';
import { SnapElement } from '../classes/Basic/Drag/SnapElements/SnapElement';
import { SnapX } from '../classes/Basic/Drag/SnapElements/SnapX';
import { LayeredGraph } from '../classes/Sugiyama/LayeredGraph';
import { SimpleGraph } from '../classes/Sugiyama/SimpleGraph';
import { Sugiyama } from '../classes/Sugiyama/Sugiyama';
import { applySugiyama as getSugiyamaLayeredGraph } from '../classes/Sugiyama/SugiyamaForDiagram';
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
    public layout(bpmnGraph: BpmnGraph, drawingArea:SVGElement): void {
        
        const w = drawingArea.clientWidth;
        const h = drawingArea.clientHeight;
        const sugi = this.getSugiyamaResult(bpmnGraph, w, h, 100);
        //drawingArea.setAttribute("viewBox", `0 0 ${sugi.neededWidth} ${sugi.neededHeight}`) // so 
        this.setCoordinates(bpmnGraph,w,h)

        this.initalLayoutHasBeenDone = true
    }
    setCoordinates(bpmnGraph: BpmnGraph, w:number, h:number) {
        for (const bpmnNode of bpmnGraph.nodes) {
            const ln = this.sugiResult!.getNode(bpmnNode.id)
            bpmnNode.setPosXY(ln!.x,ln!.y)

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
                edge.addCorner(new Vector(d.x,d.y))
            }
        }
    }

     sugiResult: LayeredGraph| undefined
    getSugiyamaResult(bpmnGraph:BpmnGraph, w = 1000, h =500 , p = 50):Sugiyama{
        const sugi = new Sugiyama(SimpleGraph.convert(bpmnGraph))
        sugi.width = w 
        sugi.height= h
        sugi.padding = p
        sugi.spacingXAxis = 200
        sugi.spacingYAxis= 100
        const result :LayeredGraph = sugi.getResult()
        this.sugiResult = result
        return sugi
      }
}
