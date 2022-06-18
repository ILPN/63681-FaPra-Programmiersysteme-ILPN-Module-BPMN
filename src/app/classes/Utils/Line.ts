import { Vector } from "./Vector";

export class Line {
    static intersectionsWithCircle(
        center: Vector,
        radius: number,
        intersectingLine: Line
    ): Vector[] {
        const line = new Line(
            intersectingLine.posV,
            intersectingLine.dir
        );

        // find line nline that is perpendicular to line and goes through the center of circle
        const n = new Vector(-line.dir.y, line.dir.x);
        const nline = new Line(center, n);

        //find intersection of line and nline
        const closestToCenter = Line.intersection(line, nline);
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

    static intersection(line1: Line, line2: Line): Vector {
        if (this.areParallel(line1, line2)) return new Vector();

        const result = new Vector();

        // line equations: posV + t * dir
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

    static areParallel(line1: Line, line2: Line) {
        if (line1.dir.x == 0 && line2.dir.x == 0) return true;
        if (line1.dir.y == 0 && line2.dir.y == 0) return true;
        if (
            (line1.dir.x / line2.dir.x).toFixed(10) ==
            (line1.dir.y / line2.dir.y).toFixed(10)
        )
            return true;

        return false;
    }

    static pointIsLeftOfLine(p: Vector, l: Line) {
        if (l.dir.y == 0) return false;
        if (l.dir.x == 0) {
            return p.x < l.posV.x;
        }
        const XOfLineAtYLevelOfPoint =
            l.posV.x + ((p.y - l.posV.y) * l.dir.x) / l.dir.y;
        return p.x < XOfLineAtYLevelOfPoint;
    }
}
