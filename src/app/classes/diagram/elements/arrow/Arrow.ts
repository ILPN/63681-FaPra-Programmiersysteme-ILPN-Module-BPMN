import { Element } from '../../element';
import { Gateway } from '../gateway';
import { Task } from '../task';
import { Event } from '../event';
import { Utility } from "src/app/classes/Utils/Utility";
import { Vector } from "src/app/classes/Utils/Vector";import { MainElement } from '../MainElement';
import { ArrowCorner } from './ArrowCorner';
import { MyDiagram } from '../../MyDiagram';
import { ArrowEndCorner } from './ArrowEndCorner';
import { ArrowInnerCorner } from './ArrowInnerCorner';
import { Line } from 'src/app/classes/Utils/Line';
import { DummyNodeCorner } from './DummyNodeCorner';

export class Arrow extends Element {
    addCornerBeforeCorner(corner: ArrowCorner): void {
        let point1, point2;
        if (
            corner.cornerBefore == this.arrowStart &&
            corner.cornerBefore instanceof ArrowEndCorner
        )
            point1 = corner.cornerBefore.intersectionPos;
        else point1 = corner.cornerBefore!.getPos();

        if (corner == this.arrowTarget && corner instanceof ArrowEndCorner)
            point2 = corner.intersectionPos;
        else point2 = corner.getPos();

        const pos = point1.plus(point2).muliplied(0.5);

        if (corner == this.arrowTarget) this.addArrowCorner(pos);
        else {
            const index = this.corners.findIndex((c) => c == corner);
            this.addArrowCorner(pos, index);
        }
    }
    removeCorner(corner: ArrowCorner) {
        this._corners = this._corners.filter((c) => c !== corner);
        this.registerCornerNeighbours();
        this.updateSvg();
    }
    onDragTo(dx: number, dy: number) {}
    private _label: String;
    private _corners: ArrowCorner[];
    public get corners() {
        return this._corners;
    }
    private _start: Element;
    private _end: Element;

    constructor(
        id: string,
        label: string,
        start: MainElement,
        end: MainElement,
        diagram: MyDiagram
    ) {
        super(id, diagram);
        this._label = label;
        this._start = start;
        this._end = end;
        this._corners = [];
        this.arrowStart = new ArrowEndCorner(
            this.id + 'StartCorner',
            start.x,
            start.y,
            this,
            start,
            diagram
        );
        this.arrowTarget = new ArrowEndCorner(
            this.id + 'TargetCorner',
            end.x,
            end.y,
            this,
            end,
            diagram
        );

        //for dragging: add arrow object to the connected elements
        start.addOutArrow(this);
        end.addInArrow(this);
    }
    clearArrowCorners() {
        this._corners = this._corners.filter(c => c instanceof DummyNodeCorner);
        this.registerCornerNeighbours()
        this.updateSvg();
    }
    addArrowCornerXY(x: number, y: number) {
        this.addArrowCorner(new Vector(x, y));
    }
    addDummyNodeCorner(id:string,x:number,y:number){
        const dNC = new DummyNodeCorner(id,x,y,this,this.diagram)
        dNC.shouldBeDrawnByArrow = false
        this.diagram.addElement(dNC)
        this._corners.push(dNC);
        this.registerCornerNeighbours();
        this.updateSvg();

    }
    addArrowCorner(pos: Vector, atPosition: number = -1) {
        const corner = new ArrowInnerCorner(
            this.id + this.corners.length,
            pos.x,pos.y,
            this,
            this.diagram
        );
        if (atPosition == -1) {
            this._corners.push(corner);
        } else {
            this._corners.splice(atPosition, 0, corner);
        }
        this.registerCornerNeighbours();
        this.updateSvg();
    }
    private registerCornerNeighbours() {
        //tell each corner who are his neighbours
        const length = this.corners.length;
        if (length == 0) {
            this.arrowStart.cornerAfter = this.arrowTarget;
            this.arrowTarget.cornerBefore = this.arrowStart;
            return
        }
        this.arrowStart.cornerAfter = this.corners[0];
        this.arrowTarget.cornerBefore = this.corners[length - 1];
        for (let i = 0; i < length; i++) {
            const before = i == 0 ? this.arrowStart : this.corners[i - 1];
            const corner = this.corners[i];
            const after =
                i == length - 1 ? this.arrowTarget : this.corners[i + 1];
            corner.cornerBefore = before;
            corner.cornerAfter = after;
        }
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
    private arrowStart: ArrowEndCorner;
    setArrowStart(x: number, y: number) {
        this.arrowStart.x = x;
        this.arrowStart.y = y;
    }
    private arrowTarget: ArrowEndCorner;
    setArrowTarget(x: number, y: number) {
        this.arrowTarget.x = x;
        this.arrowTarget.y = y;
    }
    getArrowTarget() {
        return this.arrowTarget;
    }
    getArrowStart() {
        return this.arrowStart;
    }

    public createSvg(): SVGElement {
        const svg = this.createContainerSVG();
        const lineSvgResult = this.lineSvg();

        this.arrowStart.intersectionPos = lineSvgResult.startOfLine;
        this.arrowTarget.intersectionPos = lineSvgResult.endOfLine;

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
    appendPlusAndDoubleDragCircles(svg: SVGElement) {
        const spacingHalf= 3
        if (this.corners.length == 0){
            const center = Vector.center(this.arrowStart.intersectionPos,this.arrowTarget.intersectionPos)

            svg.appendChild(this.plusCircle(center,center,0));
            return
        }
        const distinctionOfCases = (elBefore:Element,el:Element,index:number) =>{
            const dir = el.getPos().minus(elBefore.getPos()).toUnitVector()
            if(elBefore instanceof ArrowEndCorner && el instanceof ArrowInnerCorner){
                const center = Vector.center(el.getPos(), elBefore.intersectionPos)
                svg.appendChild(this.plusCircle(center.minus(dir.muliplied(spacingHalf)),center,index))
                svg.appendChild(this.doubleDragCircle(center.plus(dir.muliplied(spacingHalf)),elBefore))
                return
            }
            if(elBefore instanceof ArrowInnerCorner && el instanceof ArrowEndCorner){
                const center = Vector.center(el.intersectionPos, elBefore.getPos())
                svg.appendChild(this.plusCircle(center.minus(dir.muliplied(spacingHalf)),center,index))
                svg.appendChild(this.doubleDragCircle(center.plus(dir.muliplied(spacingHalf)),elBefore))
                return
            }  
            if(elBefore instanceof ArrowInnerCorner && el instanceof ArrowInnerCorner){
                const center = Vector.center(el.getPos(), elBefore.getPos())
                svg.appendChild(this.plusCircle(center.minus(dir.muliplied(spacingHalf)),center,index))
                svg.appendChild(this.doubleDragCircle(center.plus(dir.muliplied(spacingHalf)),elBefore))
                return
            }    
            if((elBefore instanceof ArrowInnerCorner && el instanceof DummyNodeCorner)||
            (elBefore instanceof DummyNodeCorner && el instanceof ArrowInnerCorner)){
                const center = Vector.center(el.getPos(), elBefore.getPos())
                svg.appendChild(this.plusCircle(center,center,index))
                return
            }
            if((elBefore instanceof ArrowEndCorner && el instanceof DummyNodeCorner)){
                const center = Vector.center(elBefore.intersectionPos, el.getPos())
                svg.appendChild(this.plusCircle(center,center,index))
                return
            } 
            if((elBefore instanceof DummyNodeCorner && el instanceof ArrowEndCorner)){
                const center = Vector.center(elBefore.getPos(), el.intersectionPos)
                svg.appendChild(this.plusCircle(center,center,index))
                return
            } 
        }
        for (let i = 0; i < this.corners.length; i++) {
            const el = this.corners[i];
            const elBefore = el.cornerBefore
            if(elBefore == undefined) continue
            distinctionOfCases(elBefore,el,i)           
        }
        distinctionOfCases(this.corners[this._corners.length-1],this.arrowTarget,this.corners.length)
    }
    plusCircle(pos:Vector,newCornerPos:Vector, addAtIndex:number): SVGElement {
        const circle = this.createSvgElement('circle');
        circle.classList.add('plusCircle');
        circle.setAttribute('cx', '' + pos.x);
        circle.setAttribute('cy', '' + pos.y);
            Utility.addSimulatedClickListener(circle, (e) =>
                this.addArrowCorner(newCornerPos,addAtIndex)
            );
        return circle;
    }
    doubleDragCircle(pos:Vector, draged:Element): SVGElement {
        const circle = this.createSvgElement('circle');
        circle.classList.add('doubleDragCircle');
        circle.setAttribute('cx', '' + pos.x);
        circle.setAttribute('cy', '' + pos.y);
        circle.onmousedown = e => this.diagram.onChildrenMouseDown(e,draged, this.diagram.DRAG_THIS_CORNER_AND_ITS_AFTER_CORNER)
        return circle;
    }

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

    private createContainerSVG(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', '0');
        svg.setAttribute('y', '0');
        svg.setAttribute('style', 'overflow: visible;');
        return svg;
    }
}
