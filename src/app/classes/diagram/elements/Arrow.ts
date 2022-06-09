import { tSCallSignatureDeclaration } from '@babel/types';
import { Element } from '../element';
import { ConnectorElement } from './connector-element';
import { Connectortype } from './connectortype';
import { Gateway } from './gateway';
import { Task } from './task';
import { Event } from './event';

export class Arrow extends Element {
    private _label: String;
    private _corners: ArrowCorner[];
    public get corners(){
        return this._corners
    }
    private _start: Element;
    private _end: Element;

    constructor(id: string, label: string, start: Element, end: Element) {
        super(id);
        this._label = label;
        this._start = start;
        this._end = end;
        this._corners = [];
        this.setArrowStart(start.x, start.y);
        this.setArrowTarget(end.x, end.y);
    }
    clearArrowCorners() {
        this._corners = [];
    }
    addPfeilEcke(x: number, y: number) {
        this._corners.push(new ArrowCorner(this.id + x + ' ' + y, x, y));
    }

    get start(): Element {
        return this._start;
    }

    set start(value: Element) {
        this._start = value;
    }

    get end(): Element {
        return this._end;
    }

    set end(value: Element) {
        this._end = value;
    }
    private arrowStart: Vector = new Vector();
    setArrowStart(x: number, y: number) {
        this.arrowStart.x = x;
        this.arrowStart.y = y;
    }
    private arrowTarget: Vector = new Vector();
    setArrowTarget(x: number, y: number) {
        this.arrowTarget.x = x;
        this.arrowTarget.y = y;
    }

    public createSvg(): SVGElement {
        const pointsToBeConnected: Vector[] = [];
        let secondEcke;
        let beforeLastEcke;
        if (this._corners.length > 0) {
            secondEcke = this._corners[0].toVector();
            beforeLastEcke = this._corners[this._corners.length - 1].toVector();
        } else {
            secondEcke = this.arrowTarget;
            beforeLastEcke = this.arrowStart;
        }
        const intersectionWithStartElement = this.calculateIntersection(
            secondEcke,
            this.arrowStart,
            this.start
        );
        pointsToBeConnected.push(intersectionWithStartElement);
        for (const ecke of this._corners) {
            pointsToBeConnected.push(new Vector(ecke.x, ecke.y));
        }
        const intersectionWithEndElement = this.calculateIntersection(
            beforeLastEcke,
            this.arrowTarget,
            this.end
        );
        pointsToBeConnected.push(intersectionWithEndElement);

        const svg = this.createUndergroundSVG();
        svg.append(this.lineSvg(pointsToBeConnected));
        svg.append(
            this.arrowheadSvg(
                intersectionWithEndElement,
                this.arrowTarget.minus(beforeLastEcke)
            )
        );
        this.registerSvg(svg);
        return svg;
    }
    private lineSvg(points: Vector[]) {
        let pathSvg = this.createSvgElement('path');
        pathSvg.setAttribute(
            'style',
            `fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1`
        );

        let pathString = 'M ';
        for (const point of points) {
            pathString = pathString + `${point.x},${point.y} `;
        }
        pathSvg.setAttribute('d', pathString);
        return pathSvg;
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
    calculateIntersection(
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
    intersectionWithEventElement(
        outerPoint: Vector,
        innerPoint: Vector,
        event: Event
    ): Vector {
        const center = new Vector(event.x, event.y);
        const isInside = (p: Vector) => {
            return p.distanceTo(center) < event.distanceX;
        };
        if (!isInside(innerPoint)) return innerPoint;

        const intersectingLine = new MyLine(
            new Vector(innerPoint.x, innerPoint.y),
            outerPoint.minus(innerPoint)
        );

        const intersections: Vector[] = MyLine.intersectionsWithCircle(
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
    intersectionWithElement(
        outerPoint: Vector,
        innerPoint: Vector,
        el: Element
    ): Vector {
        const inside = () => {
            if (innerPoint.x > el.x + el.distanceX) return false;
            if (innerPoint.x < el.x - el.distanceX) return false;
            if (innerPoint.y > el.y + el.distanceY) return false;
            if (innerPoint.y < el.y - el.distanceY) return false;
            return true;
        };
        if (!inside()) return innerPoint;

        const center = new Vector(el.x, el.y)
        //boundinglines: lineUp, lineRight, lineLeft, lineDown
        const lineU = new MyLine(
            new Vector(el.x, el.y - el.distanceY),
            new Vector(10, 0)
        );
        const lineR = new MyLine(
            new Vector(el.x+el.distanceX, el.y),
            new Vector(0, 10)
        );
        const lineD = new MyLine(
            new Vector(el.x, el.y + el.distanceY),
            new Vector(10, 0)
        );
        const lineL = new MyLine(
            new Vector(el.x-el.distanceX, el.y),
            new Vector(0, 10)
        );

        const boundingLines: MyLine[] = [];
        boundingLines.push(lineU);
        boundingLines.push(lineD);
        boundingLines.push(lineR);
        boundingLines.push(lineL);

        const intersectingLine = new MyLine(
            new Vector(innerPoint.x, innerPoint.y),
            outerPoint.minus(innerPoint)
        );

        const intersections: Vector[] = [];

        for (const l of boundingLines) {
            if (!MyLine.areParallel(intersectingLine, l)) {
                const intersection = MyLine.intersection(intersectingLine, l);
                if (
                    intersection.distanceTo(center) <
                    (new Vector(el.distanceX,el.distanceY)).length()+2
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
    intersectionWithGatewayElement(
        outerPoint: Vector,
        innerPoint: Vector,
        g: Gateway
    ): Vector {
        // lineUpperLeft, lineUpperRight, lineLowerLeft, lineLowerRight
        const lineUL = new MyLine(
            new Vector(g.x, g.y - g.distanceY),
            new Vector(g.distanceX, -g.distanceY)
        );
        const lineUR = new MyLine(
            new Vector(g.x, g.y - g.distanceY),
            new Vector(g.distanceX, g.distanceY)
        );
        const lineLL = new MyLine(
            new Vector(g.x, g.y + g.distanceY),
            new Vector(g.distanceX, g.distanceY)
        );
        const lineLR = new MyLine(
            new Vector(g.x, g.y + g.distanceY),
            new Vector(g.distanceX, -g.distanceY)
        );

        const boundingLines: MyLine[] = [];
        boundingLines.push(lineUL);
        boundingLines.push(lineUR);
        boundingLines.push(lineLL);
        boundingLines.push(lineLR);

        const isInside = (p: Vector) => {
            if (MyLine.pointIsLeftOfLine(p, lineUL)) return false;
            if (MyLine.pointIsLeftOfLine(p, lineLL)) return false;
            if (!MyLine.pointIsLeftOfLine(p, lineUR)) return false;
            if (!MyLine.pointIsLeftOfLine(p, lineLR)) return false;

            return true;
        };
        if (!isInside(innerPoint)) return innerPoint;

        const intersectingLine = new MyLine(
            new Vector(innerPoint.x, innerPoint.y),
            outerPoint.minus(innerPoint)
        );

        const intersections: Vector[] = [];

        for (const l of boundingLines) {
            if (!MyLine.areParallel(intersectingLine, l)) {
                const intersection = MyLine.intersection(intersectingLine, l);
                if (
                    intersection.distanceTo(new Vector(g.x, g.y)) <
                    g.distanceX + 5
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

    private createUndergroundSVG(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', '0');
        svg.setAttribute('y', '0');
        svg.setAttribute('style', 'overflow: visible;');
        return svg;
    }
}
export class ArrowCorner extends Element {
    toVector(): Vector {
        return new Vector(this.x, this.y);
    }
    private _raduis: number = 5;

    constructor(id: string, x: number, y: number) {
        super(id);
        this.x = x;
        this.y = y;
    }

    public createSvg(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', `${this.x}`);
        svg.setAttribute('y', `${this.y}`);
        svg.setAttribute('style', 'overflow: visible;');

        const circle = this.createSvgElement('circle');
        circle.setAttribute('r', `${this._raduis}`);
        circle.setAttribute('fill', 'blue');
        svg.appendChild(circle);
        // this.addSVGtoColorChange(circle);
        this.registerSvg(svg);
        return svg;
    }
}
class Vector {
    toUnitVector() {
        return this.muliplied(1 / this.length());
    }
    muliplied(m: number): Vector {
        return new Vector(this.x * m, this.y * m);
    }
    plus(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    distanceTo(to: Vector): number {
        return new Vector(this.x - to.x, this.y - to.y).length();
    }
    minus(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    private _x: number;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    private _y: number;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }
    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    rotate(angle: number): Vector {
        return new Vector(
            Math.cos(angle) * this.x - Math.sin(angle) * this.y,
            Math.sin(angle) * this.x + Math.cos(angle) * this.y
        );
    }
}
class MyLine {
    static intersectionsWithCircle(
        center: Vector,
        radius: number,
        intersectingLine: MyLine
    ): Vector[] {
        const line = new MyLine(
            intersectingLine.posV,
            intersectingLine.dir
        );

        // find line nline that is perpendicular to line and goes through the center of circle(=>(0,0))
        const n = new Vector(-line.dir.y, line.dir.x);
        const nline = new MyLine(center, n);

        //find intersection of line and nline
        const closestToCenter = MyLine.intersection(line, nline);
        // closestToCenter.distanceTo(center) must be < radius
        if(closestToCenter.distanceTo(center)>= radius) return[]
        // calculate distance a between intersection with circle and closestToCenter
        const c = radius;
        const b = closestToCenter.distanceTo(center);
        const a = Math.sqrt(c * c - b * b);

        const uV = line.dir.toUnitVector();

        const Intersection1 = closestToCenter
            .plus(uV.muliplied(a));
        const Intersection2 = closestToCenter
            .minus(uV.muliplied(a));

        return [Intersection1, Intersection2];
    }
    private _positionVector = new Vector();
    public get posV() {
        return this._positionVector;
    }
    private _directionalVector = new Vector();
    public get dir() {
        return this._directionalVector;
    }
    constructor(posVector: Vector, dirVector: Vector) {
        this._positionVector = posVector;
        this._directionalVector = dirVector;
    }

    static intersection(line1: MyLine, line2: MyLine): Vector {
        if (this.areParallel(line1, line2)) return new Vector();

        const result = new Vector();

        // line equation: posV + t * dir
        // solve to t
        const ax = line1.posV.x;
        const ay = line1.posV.y;
        const bx = line2.posV.x;
        const by = line2.posV.y;

        const dx = line1.dir.x;
        const dy = line1.dir.y;
        const cx = line2.dir.x;
        const cy = line2.dir.y;

        const t = (bx * cy + ay * cx - by * cx - ax * cy) / (dx * cy - dy * cx);
        result.x = line1.posV.x + t * line1.dir.x;
        result.y = line1.posV.y + t * line1.dir.y;

        return result;
    }

    static areParallel(line1: MyLine, line2: MyLine) {
        if (line1.dir.x == 0 && line2.dir.x == 0) return true;
        if (line1.dir.y == 0 && line2.dir.y == 0) return true;
        if (
            (line1.dir.x / line2.dir.x).toFixed(10) ==
            (line1.dir.y / line2.dir.y).toFixed(10)
        )
            return true;

        return false;
    }

    static pointIsLeftOfLine(p: Vector, l: MyLine) {
        if (l.dir.y == 0) return false;
        if (l.dir.x == 0) {
            return p.x < l.posV.x;
        }
        const XOfLineAtYLevelOfPoint =
            l.posV.x + ((p.y - l.posV.y) * l.dir.x) / l.dir.y;
        return p.x < XOfLineAtYLevelOfPoint;
    }
}
