import { Line } from "../../../Utils/Line";
import { Vector } from "../../../Utils/Vector";
import { BEdge } from "../../B/BEdge";
import { Position } from "../../Interfaces/Position";
import { Svg } from "../../Svg/Svg";
import { SvgInterface } from "../../Interfaces/SvgInterface";
import { BpmnNode } from "../BpmnNode";
import { BpmnEvent } from "../events/BpmnEvent";
import { BpmnGateway } from "../gateways/BpmnGateway";
import { BpmnTask } from "../tasks/BpmnTask";
import { BpmnEdgeCorner } from "./BpmnEdgeCorner";
import { BpmnDummyEdgeCorner } from "./BpmnDummyEdgeCorner";

export class BpmnEdge extends BEdge implements SvgInterface{
    setStartPos(x: number, y: number) {
        this._corners[0].setPosXY(x,y)
    }
    setEndPos(x: number, y: number) {
        this._corners[this._corners.length-1].setPosXY(x,y)
    }
    removeCorner(at:number) {
        console.log(this.corners)
        if(at == 0  || at >= this._corners.length-1) return
        this._corners.splice(at, 1);
        console.log(this._corners)

        this.updateSvg()
    }
    private readonly _id: string
    public get id(): string {
        return this._id
    }

    private _corners: BpmnEdgeCorner[];
    public get corners() {
        return this._corners;
    }
    from: BpmnNode;
    to: BpmnNode;

    constructor(
        id: string,
        from: BpmnNode,
        to:BpmnNode
    ) {
        super(from.id,to.id);
        this._id = id
        this.from = from;
        this.to = to;
        this._corners = 
        [new BpmnEdgeCorner(from.getPos().x,from.getPos().y),
             new BpmnEdgeCorner(to.getPos().x,to.getPos().y)];
    }
    private _svg: SVGElement | undefined;
    updateSvg(): SVGElement {
        const newSvg = this.createSvg();
        
        if(this._svg != undefined &&this._svg.isConnected){
            this._svg.replaceWith(newSvg);
        }
        this._svg = newSvg;

        return newSvg;
    }
    /**
     * removes all corners from the arrow if deletable
     */
    clearCorners() {
        this._corners = [this._corners[0], this._corners[this._corners.length-1]]
    }
    addCornerXY(x: number, y: number) {
        this.addCorner(new Vector(x, y));
    }
    private addCornerr(corner:BpmnEdgeCorner, atPosition: number = -1){
        const lastIndex = this._corners.length -1
        if (atPosition == -1) {
            this._corners.splice(lastIndex, 0, corner);
        } else {
            this._corners.splice(atPosition, 0, corner);
        }
        return corner
    }
    addCorner(pos: Vector, at: number = -1):BpmnEdgeCorner {
        const corner = new BpmnEdgeCorner(pos.x,pos.y);
        this.addCornerr(corner,at)
        return corner
    }

    addDummyCorner(id:string, pos: Vector, at: number = -1):BpmnEdgeCorner {
        const corner = new BpmnDummyEdgeCorner(id,pos);
        corner._deletable = false
        this.addCornerr(corner,at)
        return corner
    }




     createSvg(): SVGElement {
        const svg = Svg.container();
        const lineSvgResult = this.lineSvg();

        //this.pointsToBeConnected.push(lineSvgResult.startOfLine);
        //this.pointsToBeConnected.push(lineSvgResult.endOfLine);

        svg.append(lineSvgResult.svg);
        svg.append(
            Svg.pointer(
                lineSvgResult.endOfLine,
                lineSvgResult.directionOfEnd
            )
        );
        return svg;
    }


    public nodeIntersection1 = new Vector()
    public nodeIntersection2 = new Vector()
    /**
     * 
     * @returns a svg path, representing the line of the arrow
     */
    private lineSvg(): {
        svg: SVGElement;
        startOfLine: Vector;
        endOfLine: Vector;
        directionOfEnd: Vector;
    } {
        const pointsToBeConnected: Vector[] = [];
        const intersectionWithStartElement = this.calculateIntersection(
            this._corners[1].getPos(),
            this._corners[0].getPos(),
            this.from
        );
       this.nodeIntersection1 = intersectionWithStartElement
        pointsToBeConnected.push(intersectionWithStartElement);
        
        for (let i = 1; i < this._corners.length-1; i++) {
            const corner = this._corners[i];
            pointsToBeConnected.push(corner.getPos());

        }
        const lastIndex = this.corners.length -1 
        const intersectionWithEndElement = this.calculateIntersection(
            this._corners[lastIndex -1].getPos(),
            this._corners[lastIndex].getPos(),
            this.to
        );
        this.nodeIntersection2 = intersectionWithEndElement
        pointsToBeConnected.push(intersectionWithEndElement);

        const pathSvg = Svg.path(pointsToBeConnected)
        
        const endOfLine = pointsToBeConnected[pointsToBeConnected.length - 1];
        const directionOfEnd = endOfLine.minus(
            pointsToBeConnected[pointsToBeConnected.length - 2]
        );

        return {
            svg: pathSvg,
            startOfLine: intersectionWithStartElement,
            endOfLine: endOfLine,
            directionOfEnd: directionOfEnd,
        };
    }
    private calculateIntersection(
        outerPoint: Vector,
        innerPoint: Vector,
        node: BpmnNode
    ): Vector {
        if (node instanceof BpmnTask) {
            return this.intersectionWithTask(
                outerPoint,
                innerPoint,
                node
            );
        } else if (node instanceof BpmnGateway) {
            return this.intersectionWithGateway(
                outerPoint,
                innerPoint,
                node
            );
        } else if (node instanceof BpmnEvent) {
            return this.intersectionWithNode(
                outerPoint,
                innerPoint,
                node 
            );
        }
        return this.intersectionWithNode(outerPoint, innerPoint, node);
    }
    private intersectionWithNode(
        outerPoint: Vector,
        innerPoint: Vector,
        node: BpmnNode
    ): Vector {
        const center = node.getPos();
        const isInside = (p: Vector) => {
            return p.distanceTo(center) < node.radius;
        };
        if (!isInside(innerPoint)) return innerPoint;

        const intersectingLine = new Line(
            new Vector(innerPoint.x, innerPoint.y),
            outerPoint.minus(innerPoint)
        );

        const intersections: Vector[] = Line.intersectionsWithCircle(
            center,
            node.radius,
            intersectingLine
        );
        intersections.sort(
            (a: Vector, b: Vector) =>
                a.distanceTo(outerPoint) - b.distanceTo(outerPoint)
        );
        return intersections[0];
    }
    private intersectionWithTask(
        outerPoint: Vector,
        innerPoint: Vector,
        el: BpmnTask
    ): Vector {
        const inside = () => {
            if (innerPoint.x > el.getPos().x + el.width/2) return false;
            if (innerPoint.x < el.getPos().x - el.width/2) return false;
            if (innerPoint.y > el.getPos().y + el.heigth/2) return false;
            if (innerPoint.y < el.getPos().y - el.heigth/2) return false;
            return true;
        };
        if (!inside()) return innerPoint;
        const center = el.getPos();
        //boundinglines: lineUp, lineRight, lineLeft, lineDown
        const halfWidth = el.width/2
        const halfHeight = el.heigth/2
        const lineU = new Line(
            center.plusXY(0, -halfHeight),
            new Vector(10, 0)
        );
        const lineR = new Line(
            el.getPos().plusXY(halfWidth, 0),
            new Vector(0, 10)
        );
        const lineD = new Line(
            center.plusXY(0, halfHeight),
            new Vector(10, 0)
        );
        const lineL = new Line(
            el.getPos().plusXY(-halfWidth, 0),
            new Vector(0, 10)
        );

        const boundingLines: Line[] = [];
        boundingLines.push(lineU);
        boundingLines.push(lineD);
        boundingLines.push(lineR);
        boundingLines.push(lineL);

        const intersectingLine = new Line(
            new Vector(innerPoint.x, innerPoint.y),
            outerPoint.minus(innerPoint)
        );

        const intersections: Vector[] = [];

        for (const l of boundingLines) {
            if (!Line.areParallel(intersectingLine, l)) {
                const intersection = Line.intersection(intersectingLine, l);
                if (
                    intersection.distanceTo(center) <
                    new Vector(halfWidth, halfHeight).length() + 0.1
                ) {
                    intersections.push(intersection);
                }
            }
        }
        if (intersections.length == 0) {
            return innerPoint;
        }
        intersections.sort(
            (a: Vector, b: Vector) =>
                a.distanceTo(outerPoint) - b.distanceTo(outerPoint)
        );

        return intersections[0];
    }
    private intersectionWithGateway(
        outerPoint: Vector,
        innerPoint: Vector,
        g: BpmnGateway
    ): Vector {
        // lineUpperLeft, lineUpperRight, lineLowerLeft, lineLowerRight
        const halfWidth = g.width/2
        const halfHeight = g.width/2
        const lineUL = new Line(
            new Vector(g.getPos().x, g.getPos().y - halfHeight),
            new Vector(halfWidth, -halfHeight)
        );
        const lineUR = new Line(
            new Vector(g.getPos().x, g.getPos().y - halfHeight),
            new Vector(halfWidth, halfHeight)
        );
        const lineLL = new Line(
            new Vector(g.getPos().x, g.getPos().y + halfHeight),
            new Vector(halfWidth, halfHeight)
        );
        const lineLR = new Line(
            new Vector(g.getPos().x, g.getPos().y + halfHeight),
            new Vector(halfWidth, -halfHeight)
        );

        const boundingLines: Line[] = [];
        boundingLines.push(lineUL);
        boundingLines.push(lineUR);
        boundingLines.push(lineLL);
        boundingLines.push(lineLR);

        const isInside = (p: Vector) => {
            if (Line.pointIsLeftOfLine(p, lineUL)) return false;
            if (Line.pointIsLeftOfLine(p, lineLL)) return false;
            if (!Line.pointIsLeftOfLine(p, lineUR)) return false;
            if (!Line.pointIsLeftOfLine(p, lineLR)) return false;

            return true;
        };
        if (!isInside(innerPoint)) return innerPoint;

        const intersectingLine = new Line(
            new Vector(innerPoint.x, innerPoint.y),
            outerPoint.minus(innerPoint)
        );

        const intersections: Vector[] = [];

        for (const l of boundingLines) {
            if (!Line.areParallel(intersectingLine, l)) {
                const intersection = Line.intersection(intersectingLine, l);
                if (intersection.distanceTo(g.getPos()) < halfWidth + 0.2) {
                    intersections.push(intersection);
                }
            }
        }
        if (intersections.length == 0) {
            return innerPoint;
        }
        intersections.sort(
            (a: Vector, b: Vector) =>
                a.distanceTo(outerPoint) - b.distanceTo(outerPoint)
        );

        return intersections[0];
    }


}
