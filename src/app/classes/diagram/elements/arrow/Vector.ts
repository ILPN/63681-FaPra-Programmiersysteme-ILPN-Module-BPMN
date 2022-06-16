export class Vector {
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