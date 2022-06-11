import { Element } from '../../element';
import { Gateway } from '../gateway';
import { Task } from '../task';
import { Event } from '../event';
import { Vector } from './Vector';
import { Line } from './Line';

export class Arrow extends Element {
    private _label: String;
    private _corners: ArrowCorner[];
    public get corners() {
        return this._corners;
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

        //for dragging: add arrow object to the connected elements 
        start.addOutArrow(this);
        end.addInArrow(this);
    }
    clearArrowCorners() {
        this._corners = [];
    }
    addArrowCorner(x: number, y: number) {
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
        const parentSvgElement = this.createUndergroundSVG();
        const lineSvgResult = this.lineSvg();
        const lineSvgElement = lineSvgResult.svg;

        parentSvgElement.append(lineSvgElement);
        parentSvgElement.append(this.arrowheadSvg(
            lineSvgResult.endOfLine,
            lineSvgResult.directionOfEnd
        ));
        this.registerSvg(parentSvgElement);
        return parentSvgElement;
    }
    private lineSvg(): {
        svg: SVGElement;
        endOfLine: Vector;
        directionOfEnd: Vector;
    } {
        const pointsToBeConnected: Vector[] = [];
        let secondCorner;
        let beforeLastCorner;
        if (this._corners.length > 0) {
            secondCorner = this._corners[0].toVector();
            beforeLastCorner =
                this._corners[this._corners.length - 1].toVector();
        } else {
            secondCorner = this.arrowTarget;
            beforeLastCorner = this.arrowStart;
        }
        const intersectionWithStartElement = this.calculateIntersection(
            secondCorner,
            this.arrowStart,
            this.start
        );
        pointsToBeConnected.push(intersectionWithStartElement);
        for (const corner of this._corners) {
            pointsToBeConnected.push(new Vector(corner.x, corner.y));
        }
        const intersectionWithEndElement = this.calculateIntersection(
            beforeLastCorner,
            this.arrowTarget,
            this.end
        );
        pointsToBeConnected.push(intersectionWithEndElement);

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

        const center = new Vector(el.x, el.y);
        //boundinglines: lineUp, lineRight, lineLeft, lineDown
        const lineU = new Line(
            new Vector(el.x, el.y - el.distanceY),
            new Vector(10, 0)
        );
        const lineR = new Line(
            new Vector(el.x + el.distanceX, el.y),
            new Vector(0, 10)
        );
        const lineD = new Line(
            new Vector(el.x, el.y + el.distanceY),
            new Vector(10, 0)
        );
        const lineL = new Line(
            new Vector(el.x - el.distanceX, el.y),
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
    intersectionWithGatewayElement(
        outerPoint: Vector,
        innerPoint: Vector,
        g: Gateway
    ): Vector {
        // lineUpperLeft, lineUpperRight, lineLowerLeft, lineLowerRight
        const lineUL = new Line(
            new Vector(g.x, g.y - g.distanceY),
            new Vector(g.distanceX, -g.distanceY)
        );
        const lineUR = new Line(
            new Vector(g.x, g.y - g.distanceY),
            new Vector(g.distanceX, g.distanceY)
        );
        const lineLL = new Line(
            new Vector(g.x, g.y + g.distanceY),
            new Vector(g.distanceX, g.distanceY)
        );
        const lineLR = new Line(
            new Vector(g.x, g.y + g.distanceY),
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
                if (
                    intersection.distanceTo(new Vector(g.x, g.y)) <
                    g.distanceX + 0.2
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
        circle.setAttribute('style', 'fill:#00b8ff;stroke:none;stroke-width:3.77953;fill-opacity:0.28961748');
        svg.appendChild(circle);
        // this.addSVGtoColorChange(circle);
        this.registerSvg(svg);
        return svg;
    }
}
