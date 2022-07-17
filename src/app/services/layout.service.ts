import { Injectable } from '@angular/core';
import { BpmnGraph } from '../classes/Basic/Bpmn/BpmnGraph';
import { SnapElement } from '../classes/Basic/Drag/SnapElements/SnapElement';
import { SnapPoint } from '../classes/Basic/Drag/SnapElements/SnapPoint';
import { SnapX } from '../classes/Basic/Drag/SnapElements/SnapX';
import { SnapY } from '../classes/Basic/Drag/SnapElements/SnapY';
import { LeveledGraph, LNode } from '../classes/Sugiyama/LeveledGraph';
import { SimpleGraph } from '../classes/Sugiyama/SimpleGraph';
import { Sugiyama } from '../classes/Sugiyama/Sugiyama';
import { Vector } from '../classes/Utils/Vector';
import { ParserService } from './parser.service';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    constructor(
        private _parserService: ParserService,
    ){}
    layoutIfNeeded(bpmnGraph: BpmnGraph, w: number, h: number) {
        if (!this.initalLayoutHasBeenDone) {
            this.layout(bpmnGraph, w, h);
        }
    }
    getSnapsForNode(): SnapElement[] {
        const snaps = [];

        //snaps.push(new SnapX(this.getPosForLevelAndOrder(ln.level,ln.order).x))
        const biggestOrderIndex =
            [...this.sugiResult!.levels].sort(
                (l1, l2) => l2.length - l1.length
            )[0].length - 1;

        for (let level = 0; level < this.sugiResult!.levels.length; level++) {
            snaps.push(new SnapX(this.getPosForLevelAndOrder(level, 0).x));
        }
        for (let i = 0; i <= biggestOrderIndex; i++) {
            snaps.push(new SnapY(this.getPosForLevelAndOrder(0, i).y));
        }
        return snaps;
    }
    getSnapsFor(id: string): SnapElement[] {
        /*
        const ln = this.sugiResult?.getNode(id)
        if(ln == undefined) return[]
        const snaps = []
        snaps.push(new SnapX(this.getPosForLevelAndOrder(ln.level,ln.order).x))

        const biggestOrderIndex = [...this.sugiResult!.levels].sort((l1,l2) =>l2.length -l1.length)[0].length-1
        for (let i = 0; i <= biggestOrderIndex; i++) {
            snaps.push(new SnapPoint(this.getPosForLevelAndOrder(ln.level,i)))
            
        }
        */
        return this.getSnapsForNode();
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

    public layout(bpmnGraph: BpmnGraph, w: number, h: number): void {
        this.getSugiyamaResult(bpmnGraph);

        this.width = w;
        this.height = h;

        this.getGraphDimensions();
        this.scaleWidthAndHeightIfGraphToBig();

        this.setCoordinates(bpmnGraph);

        
        this._parserService.setHardcodedPositions(bpmnGraph)
        this.initalLayoutHasBeenDone = true;
    }
    scaleWidthAndHeightIfGraphToBig() {
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
    setCoordinates(bpmnGraph: BpmnGraph) {
        for (const bpmnNode of bpmnGraph.nodes) {
            const ln = this.sugiResult!.getNode(bpmnNode.id);
            bpmnNode.setPos(this.getPosForLevelAndOrder(ln!.level, ln!.order));

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
                    this.getPosForLevelAndOrder(d.level, d.order)
                );
            }
        }
    }

    private _graphDimensions: Vector | undefined;
    public getGraphDimensions(): Vector {
        if (this._graphDimensions != undefined) return this._graphDimensions;

        let biggestX = 0;
        let biggestY = 0;
        for (const n of this.sugiResult!.getAllNodes()) {
            const pos = this.getPosForLevelAndOrder(n.level, n.order);
            if (pos.x > biggestX) biggestX = pos.x;
            if (pos.y > biggestY) biggestY = pos.y;
        }
        this._graphDimensions = new Vector(biggestX, biggestY);
        return this._graphDimensions;
    }
    private getPosForLevelAndOrder(level: number, order: number): Vector {
        const x = level * this.spacingXAxis;
        const y = order * this.spacingYAxis;
        return new Vector(x, y);
    }

    sugiResult: LeveledGraph | undefined;
    getSugiyamaResult(bpmnGraph: BpmnGraph): Sugiyama {
        const sugi = new Sugiyama(SimpleGraph.convert(bpmnGraph));
        const result: LeveledGraph = sugi.getResult();
        this.sugiResult = result;
        return sugi;
    }
}
