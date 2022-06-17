import { Vector } from "../../Utils/Vector";
import { BEdge } from "../B/BEdge";
import { Position } from "../Position";
import { Svg } from "../Svg/Svg";
import { SvgInterface } from "../SvgInterface";
import { BpmnNode } from "./BpmnNode";

export class BpmnEdge extends BEdge implements SvgInterface{
    private readonly _id: string
    public get id(): string {
        return this._id
    }

    private _corners: BpmnEdgeCorner[];
    public get corners() {
        return this._corners;
    }
    private pointsToBeConnected: Vector[] = []
    private from: BpmnNode;
    private to: BpmnNode;

    constructor(
        id: string,
        from: BpmnNode,
        to:BpmnNode
    ) {
        super(from.id,to.id);
        this._id = id
        this.from = from;
        this.to = to;
        this._corners = [];
    }
    private _svg: SVGElement | undefined;
    getSvg(): SVGElement {
       this._svg = this.updateSvg();
        return this._svg;
    }
    setSvg(value: SVGElement): void {
        if(this._svg != undefined &&this._svg.isConnected){
            this._svg.replaceWith(value);
        }
        this._svg = value;
    }

    updateSvg(): SVGElement {
        const newSvg = this.createSvg();
        this.setSvg(newSvg)
        return newSvg;
    }
    /**
     * removes all corners from the arrow if deletable
     */
    clearArrowCorners() {
        this._corners = []
    }
    addArrowCornerXY(x: number, y: number) {
        this.addArrowCorner(new Vector(x, y));
    }
    addArrowCorner(pos: Vector, atPosition: number = -1) {
        const corner = new BpmnEdgeCorner(pos.x,pos.y);
        if (atPosition == -1) {
            this._corners.push(corner);
        } else {
            this._corners.splice(atPosition, 0, corner);
        }
    }




    protected createSvg(): SVGElement {
        const svg = Svg.container();
        const lineSvgResult = this.lineSvg();

        //this.pointsToBeConnected.push(lineSvgResult.startOfLine);
        //this.pointsToBeConnected.push(lineSvgResult.endOfLine);

        svg.append(lineSvgResult.svg);
        svg.append(
            this.arrowheadSvg(
                lineSvgResult.endOfLine,
                lineSvgResult.directionOfEnd
            )
        );
        for (const corner of this.corners) {
            if(corner.shouldBeDrawnByArrow){
                svg.appendChild(corner.updateSvg());
            }
        }
        svg.appendChild(this.arrowStart.updateSvg());
        svg.appendChild(this.arrowTarget.updateSvg());
        this.appendPlusAndDoubleDragCircles(svg)
        return svg;
    }

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
        let secondCorner;
        let beforeLastCorner;
        if (this._corners.length > 0) {
            secondCorner = this._corners[0].getPos();
            beforeLastCorner = this._corners[this._corners.length - 1].getPos();
        } else {
            secondCorner = this.arrowTarget.getPos();
            beforeLastCorner = this.arrowStart.getPos();
        }
        const intersectionWithStartElement = this.calculateIntersection(
            secondCorner,
            this.arrowStart.getPos(),
            this.start
        );
        if(intersectionWithStartElement != undefined){
            pointsToBeConnected.push(intersectionWithStartElement);
        }
        for (const corner of this._corners) {
            pointsToBeConnected.push(corner.getPos());
        }
        const intersectionWithEndElement = this.calculateIntersection(
            beforeLastCorner,
            this.arrowTarget.getPos(),
            this.end
        );
        if(intersectionWithEndElement != undefined){
            pointsToBeConnected.push(intersectionWithEndElement);
        }

        let pathSvg = this.createSvgElement('path');
        pathSvg.setAttribute(
            'style',
            `fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1`
        );
        let pathString = 'M ';
        for (const point of pointsToBeConnected) {
            pathString = pathString + `${point.x},${point.y} `;
        }
        pathSvg.setAttribute('d', pathString);
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
    private arrowheadSvg(position: Vector, direction: Vector): SVGElement {
        const headLength = 10;
        const headWidth = 10;

        var theta = Math.atan2(direction.y, direction.x) + Math.PI / 2; // range (-PI, PI]
        const arrowhead = this.createSvgElement('path');
        arrowhead.setAttribute(
            'style',
            `fill:#000000;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1`
        );
        const v1 = new Vector(headWidth / 2, headLength).rotate(theta);
        const v2 = new Vector(-headWidth, 0).rotate(theta);

        arrowhead.setAttribute(
            'd',
            `m ${position.x},${position.y} ${v1.x},${v1.y} ${v2.x},${v2.y}`
        );
        return arrowhead;
    }
    private calculateIntersection(
        outerPoint: Vector,
        innerPoint: Vector,
        element: Element
    ): Vector {
        if (element instanceof Task) {
            return this.intersectionWithElement(
                outerPoint,
                innerPoint,
                element
            );
        } else if (element instanceof Gateway) {
            return this.intersectionWithGatewayElement(
                outerPoint,
                innerPoint,
                element as Gateway
            );
        } else if (element instanceof Event) {
            return this.intersectionWithEventElement(
                outerPoint,
                innerPoint,
                element as Event
            );
        }
        return this.intersectionWithElement(outerPoint, innerPoint, element);
    }
    private intersectionWithEventElement(
        outerPoint: Vector,
        innerPoint: Vector,
        event: Event
    ): Vector {
        const center = event.getPos();
        const isInside = (p: Vector) => {
            return p.distanceTo(center) < event.distanceX;
        };
        if (!isInside(innerPoint)) return innerPoint;

        const intersectingLine = new Line(
            new Vector(innerPoint.x, innerPoint.y),
            outerPoint.minus(innerPoint)
        );

        const intersections: Vector[] = Line.intersectionsWithCircle(
            center,
            event.distanceX,
            intersectingLine
        );
        intersections.sort(
            (a: Vector, b: Vector) =>
                a.distanceTo(outerPoint) - b.distanceTo(outerPoint)
        );
        return intersections[0];
    }
    private intersectionWithElement(
        outerPoint: Vector,
        innerPoint: Vector,
        el: Element
    ): Vector {
        const inside = () => {
            if (innerPoint.x > el.getPos().x + el.distanceX) return false;
            if (innerPoint.x < el.getPos().x - el.distanceX) return false;
            if (innerPoint.y > el.getPos().y + el.distanceY) return false;
            if (innerPoint.y < el.getPos().y - el.distanceY) return false;
            return true;
        };
        if (!inside()) return innerPoint;

        const center = el.getPos();
        //boundinglines: lineUp, lineRight, lineLeft, lineDown
        const lineU = new Line(
            center.plusXY(0, -el.distanceY),
            new Vector(10, 0)
        );
        const lineR = new Line(
            el.getPos().plusXY(el.distanceX, 0),
            new Vector(0, 10)
        );
        const lineD = new Line(
            center.plusXY(0, el.distanceY),
            new Vector(10, 0)
        );
        const lineL = new Line(
            el.getPos().plusXY(-el.distanceX, 0),
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
                    new Vector(el.distanceX, el.distanceY).length() + 0.1
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
    private intersectionWithGatewayElement(
        outerPoint: Vector,
        innerPoint: Vector,
        g: Gateway
    ): Vector {
        // lineUpperLeft, lineUpperRight, lineLowerLeft, lineLowerRight
        const lineUL = new Line(
            new Vector(g.getPos().x, g.getPos().y - g.distanceY),
            new Vector(g.distanceX, -g.distanceY)
        );
        const lineUR = new Line(
            new Vector(g.getPos().x, g.getPos().y - g.distanceY),
            new Vector(g.distanceX, g.distanceY)
        );
        const lineLL = new Line(
            new Vector(g.getPos().x, g.getPos().y + g.distanceY),
            new Vector(g.distanceX, g.distanceY)
        );
        const lineLR = new Line(
            new Vector(g.getPos().x, g.getPos().y + g.distanceY),
            new Vector(g.distanceX, -g.distanceY)
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
                if (intersection.distanceTo(g.getPos()) < g.distanceX + 0.2) {
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

class BpmnEdgeCorner implements Position{
    constructor(x:number = 0, y:number = 0){
        this._x = x
        this._y = y
    }
    getPos(): Vector {
        return new Vector(this.x, this.y);
    }
    setPos(pos: Vector): void {
        this.x = pos.x;
        this.y = pos.y;
    }
    setPosXY(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
    private _x: number = 0;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    private _y: number = 0;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }

}