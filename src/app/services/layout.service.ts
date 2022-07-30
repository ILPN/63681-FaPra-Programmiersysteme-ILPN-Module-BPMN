import { Injectable } from '@angular/core';
import { BpmnGraph } from '../classes/Basic/Bpmn/BpmnGraph';
import { SnapElement } from '../classes/Basic/Drag/SnapElements/SnapElement';
import { SnapPoint } from '../classes/Basic/Drag/SnapElements/SnapPoint';
import { SnapX } from '../classes/Basic/Drag/SnapElements/SnapX';
import { SnapY } from '../classes/Basic/Drag/SnapElements/SnapY';
import { TableGraph, LNode } from '../classes/Sugiyama/TableGraph';
import { SimpleGraph } from '../classes/Sugiyama/SimpleGraph';
import { Sugiyama } from '../classes/Sugiyama/Sugiyama';
import { Vector } from '../classes/Utils/Vector';
import { ParserService } from './parser.service';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
   
    applySugiyama(bpmnGraph: BpmnGraph) {
        this.getSugiyamaResult(bpmnGraph);
        this.setCoordinates(bpmnGraph);
    }
    getSnapsForNode(): SnapElement[] {
        const snaps = [];
        const snapCountX = 60
        const snapCountY = 60

        for (let col = -snapCountX*0.5; col < snapCountX*0.5; col++) {
            snaps.push(new SnapX(this.getPosForColumnAndRow(col, 0).x));
        }

        for (let row = -snapCountY*0.5; row < snapCountY*0.5; row++) {
            snaps.push(new SnapY(this.getPosForColumnAndRow(0, row).y));
        }

        return snaps;
    }
    private spacingXAxis = 200;
    private spacingYAxis = 110;
    private padding = new Vector(100, 50);

    /**
     * sets a Viewbox to svgWithViewbox. If svgToZoomTo(+padding) fits into the view, the viewbox is set, so that svgToZoomTo is centered
     * If svgToZoomTo doesn't fit, the viewbox is set so that svgToZoomTo is centered and fits into the view
     * @param svgToZoomTo 
     * @param svgWithViewbox 
     * @param view 
     */
    zoomViewToSvg(svgToZoomTo: SVGElement, svgWithViewbox: SVGElement, view:SVGElement) {
        if(!(svgToZoomTo instanceof SVGGraphicsElement)) throw Error("svgToZoomTo not instanceof SVGGraphicsElement")
        const bBox = svgToZoomTo.getBBox()

        if(view.clientWidth >= bBox.width+ 2*this.padding.x &&
            view.clientHeight >= bBox.height + 2 * this.padding.y){
                const centerOfBBox = new Vector(bBox.x + (bBox.width * 0.5), bBox.y+ (bBox.height * 0.5))
                const centerOfView = (new Vector(view.clientWidth, view.clientHeight)).half()
                const delta = centerOfView.minus(centerOfBBox)
                svgWithViewbox.setAttribute(
                    'viewBox',
                    `${-delta.x} ${-delta.y} ${view.clientWidth} ${view.clientHeight}`
                );
            }else{
                svgWithViewbox.setAttribute(
                    'viewBox',
                    `${bBox.x- this.padding.x} ${bBox.y-this.padding.y} ${bBox.width+ 2* this.padding.x} ${bBox.height+ 2* this.padding.y}`
                );
            }
        
    }

    private setCoordinates(bpmnGraph: BpmnGraph) {
        for (const bpmnNode of bpmnGraph.nodes) {
            const ln = this.sugiResult!.getNode(bpmnNode.id);
            bpmnNode.setPos(this.getPosForColumnAndRow(ln!.column, ln!.row));

            const inEdges = bpmnGraph.edges.filter((e) => e.to == bpmnNode);
            for (const inEdge of inEdges) {
                inEdge.clearCorners();
                inEdge.setEndPos(bpmnNode.getPos().x, bpmnNode.getPos().y);
            }
            const outEdges = bpmnGraph.edges.filter((e) => e.from == bpmnNode);
            for (const outEdge of outEdges) {
                outEdge.clearCorners();
                outEdge.setStartPos(bpmnNode.getPos().x, bpmnNode.getPos().y);
            }
        }
        //add Dumynodes as edgecorners
        for (const edge of bpmnGraph.edges) {
            const dNodes = this.sugiResult!.getSortedDummysForEdge(
                edge.fromId,
                edge.toId
            );
            for (const d of dNodes) {
                edge.addDummyCorner(
                    d.id,
                    this.getPosForColumnAndRow(d.column, d.row)
                );
            }
        }
    }

    private getPosForColumnAndRow(column: number, order: number): Vector {
        const x = column * this.spacingXAxis;
        const y = order * this.spacingYAxis;
        return new Vector(x, y);
    }

    private _sugiResult: TableGraph | undefined;
    public get sugiResult(): TableGraph | undefined {
        return this._sugiResult;
    }
    private getSugiyamaResult(bpmnGraph: BpmnGraph): Sugiyama {
        const sugi = new Sugiyama(SimpleGraph.convert(bpmnGraph));
        const result: TableGraph = sugi.getResult();
        this._sugiResult = result;
        return sugi;
    }
}
