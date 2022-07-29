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
        console.log("sugiing around")
        this.layout(bpmnGraph);

    }

    constructor(
        private _parserService: ParserService,
    ){}
    getSnapsFor(id: string): SnapElement[] {
        return this.getSnapsForNode();
    }
    getSnapsForNode(): SnapElement[] {
        const snaps = [];
        if(this.sugiResult == undefined) return []

        const lowestRow =
            this.sugiResult.getAllNodes().map(n => n.row).sort((a,b)=> b-a)[0]

        for (let column = 0; column < this.sugiResult!.columns.length; column++) {
            snaps.push(new SnapX(this.getPosForColumnAndRow(column, 0).x));
        }
        for (let i = -1; i <= lowestRow+1; i++) {
            snaps.push(new SnapY(this.getPosForColumnAndRow(0, i).y));
        }
        return snaps;
    }

    initalLayoutHasBeenDone = false;
    private width: number = 0;
    private height: number = 0;

    private spacingXAxis = 200;
    private spacingYAxis = 110;
    private padding = new Vector(100, 50);
    public setViewBox(drawingArea: SVGElement) {
        const centerOfView = new Vector(this.width, this.height).half();
        const centerOfGraph = this._graphDimensions!.half();
        const shift = centerOfGraph.minus(centerOfView);
        drawingArea.setAttribute(
            'viewBox',
            `${shift.x} ${shift.y} ${this.width} ${this.height}`
        );
    }

    zoomDrawingAreaToSvg(svgToZoomTo: SVGElement, drawingArea: SVGElement) {
        if(!(svgToZoomTo instanceof SVGGraphicsElement)) throw Error("svgToZoomTo not instanceof SVGGraphicsElement")
        const bBox = svgToZoomTo.getBBox()
        drawingArea.setAttribute(
            'viewBox',
            `${bBox.x- this.padding.x} ${bBox.y-this.padding.y} ${bBox.width+ 2* this.padding.x} ${bBox.height+ 2* this.padding.y}`
        );
    }

    public layout(bpmnGraph: BpmnGraph): void {
        this.getSugiyamaResult(bpmnGraph);
        this.setCoordinates(bpmnGraph);
        //this._parserService.setHardcodedPositions(bpmnGraph)
    }
    private scaleWidthAndHeightIfGraphToBig() {
        const xRatio =
            (this._graphDimensions!.x + 2 * this.padding.x) / this.width;
        const yRatio =
            (this._graphDimensions!.y + 2 * this.padding.y) / this.height;
        const scalingFactor = xRatio > yRatio ? xRatio : yRatio;
        if (scalingFactor > 1) {
            this.width = this.width * scalingFactor;
            this.height = this.height * scalingFactor;
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

    private _graphDimensions: Vector | undefined;
    private getGraphDimensions(): Vector {
        let biggestX = 0;
        let biggestY = 0;
        for (const n of this.sugiResult!.getAllNodes()) {
            const pos = this.getPosForColumnAndRow(n.column, n.row);
            if (pos.x > biggestX) biggestX = pos.x;
            if (pos.y > biggestY) biggestY = pos.y;
        }
        this._graphDimensions = new Vector(biggestX, biggestY);
        return this._graphDimensions;
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
