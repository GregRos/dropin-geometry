import { Rad } from "./angles";
import math = require("mathjs");
import { CartesianComplex, CartesianPoint, ImplicitVec, PolarPoint } from "../vector-types";
import { mat } from "./mat";
import { ImplicitMat } from "../matrix-types";

const Complex = require("complex.js");

function unifyVector(a: ImplicitVec, b?: number) {
    if (a instanceof Vec) {
        return new Vec(a.x, a.y);
    } else if (typeof a === "number") {
        if (typeof b === "number") {
            return new Vec(a, b);
        } else {
            return new Vec(a, a);
        }
    } else if (Array.isArray(a)) {
        return new Vec(a[0], a[1]);
    } else if (a.hasOwnProperty("x")) {
        let p = a as CartesianPoint;
        return new Vec(p.x, p.y);
    } else if (a.hasOwnProperty("re")) {
        let z = a as CartesianComplex;
        if ((a as any).isInfinite) {

        }
        return new Vec(z.re, z.im);
    } else if (a.hasOwnProperty("phi")) {
        let z = a as PolarPoint;
        return new Vec(Math.cos(z.phi) * z.r, Math.sin(z.phi) * z.r);
    }
    throw new Error("Not a unknown vector, complex, or point type.");
}

export function vec(x: ImplicitVec, y?: number) {
    return unifyVector(x, y);
}

export function polar(r: number, phi: number) {
    return vec(Math.cos(phi) * r, Math.sin(phi) * r);
}

export class Vec {
    constructor(public x: number, public y: number) {

    }

    get arr() {
        return [this.x, this.y] as [number, number];
    }

    get complex(): CartesianComplex {
        return {
            re: this.x,
            im: this.y
        };
    }

    get polar(): PolarPoint {
        return {
            phi: this.angle(),
            r: this.len
        };
    }

    get im(): number {
        return this.y;
    }

    get re(): number {
        return this.x;
    }

    get isZero(): boolean {
        return !!(math.isZero(this.x) && math.isZero(this.y));
    }

    get len(): number {
        return +math.norm(this.arr);
    }

    get simple(): CartesianPoint {
        return {
            x: this.x,
            y: this.y
        };
    }

    get unit(): Vec {
        let result = this.len;
        return this.mul(1 / result);
    }

    [Symbol.iterator](): Iterator<number> {
        return this.arr[Symbol.iterator]();
    }

    add(x: number | ImplicitVec, y?: number): Vec {
        let vs = unifyVector(x, y);
        vs.x += this.x;
        vs.y += this.y;
        return vs;
    }


    angle(v?: ImplicitVec, y ?: number): Rad {
        // Case where horizontal angle is requested:
        if (v == null) return Math.atan2(this.y, this.x);
        let vs = unifyVector(v, y);
        return Math.atan2(this.x * vs.y + this.y * vs.x, this.x * vs.x + this.y * vs.y);
    }


    dot(x: number | ImplicitVec, y?: number): number {
        let vs = unifyVector(x, y);
        return math.dot(this.arr, vs.arr);
    }

    eq(v: ImplicitVec, y?: number): boolean {
        let vs = unifyVector(v, y);
        return !!(math.equal(this.x, vs.x) && math.equal(this.y, vs.y));
    }

    isCollinear(v: ImplicitVec, y?: number): boolean {
        let vs = unifyVector(v, y);
        return this.x * vs.y - vs.x * this.y === 0;
    }

    isOrth(v: ImplicitVec, y?: number): boolean {
        let vs = unifyVector(v, y);
        return this.dot(vs) === 0;
    }

    mid(p: ImplicitVec, y?: number): Vec {
        let vs = unifyVector(p, y);
        vs.x = (vs.x + this.x) / 2;
        vs.y = (vs.y + this.y) / 2;
        return vs;
    }

    mod(v: ImplicitVec | number, y?: number): Vec {
        let vs = unifyVector(v, y);
        vs.x = this.x % vs.x;
        vs.y = this.y % vs.y;
        return vs;
    }

    proj(v: ImplicitVec, y?: number): Vec {
        let vs = unifyVector(v, y);
        let factor = vs.dot(this) / vs.len ** 2;
        vs.x *= factor;
        vs.y *= factor;
        return vs;
    }

    get isInfinity() {
        return !Number.isFinite(this.x) || !Number.isFinite(this.y);
    }

    get isNaN() {
        return !Number.isNaN(this.x) || !Number.isNaN(this.y);
    }

    reflectAxis(v: ImplicitVec | number, y?: number): Vec {
        let vs = unifyVector(v, y);
        let unit = vs.unit;
        return vs.zmul(unit.zconj()).zconj().zmul(unit);
    }

    rotate(theta: Rad): Vec {
        return this.zmul(polar(1, theta));
    }

    mul(v: ImplicitVec | number, y?: number): Vec {
        let vs = unifyVector(v, y);
        vs.x = vs.x * this.x;
        vs.y = vs.y * this.y;
        return vs;
    }

    sub(v: ImplicitVec | number, y?: number): Vec {
        let vs = unifyVector(v, y);
        vs.x = this.x - vs.x;
        vs.y = this.y - vs.y;
        return vs;
    }

    toVecString(): string {
        return `${this.x}x̂ + ${this.y}ŷ`;
    }

    div(v: ImplicitVec | number, y?: number): Vec {
        let vs = unifyVector(v, y);
        vs.x = this.x / vs.x;
        vs.y = this.y / vs.y;
        return vs;
    }

    get neg(): Vec {
        return unifyVector(-this.x, -this.y);
    }

    get as3(): [number, number, number] {
        return [this.x, this.y, 1];
    }

    zconj(): Vec {
        return vec(-this.x, this.y);
    }

    zdiv(z: ImplicitVec | number, y?: number): Vec {
        let vs = unifyVector(z, y);
        return unifyVector(new Complex(this).div(vs));
    }

    zdivs(z: ImplicitVec | number, y?: number): Vec {
        let vs = unifyVector(z, y);
        return vs.zdiv(this);
    }

    zexp(z: ImplicitVec | number, y?: number): Vec {
        let vs = unifyVector(z, y);
        let thisCx = new Complex(this);
        let vsCx = new Complex(vs);
        return unifyVector(thisCx.pow(vsCx));
    }

    zlog(z?: ImplicitVec | number, y?: number): Vec {
        if (z == null) return unifyVector(new Complex(this).log());
        let vs = unifyVector(z, y);
        let thisCx = new Complex(this);
        let rCx = thisCx.log().div(vs.zlog());
        return unifyVector(rCx);
    }

    zmul(z: ImplicitVec | number, y?: number): Vec {
        let vs = unifyVector(z, y);
        return unifyVector(new Complex(this).mul(vs));
    }

    zstring(): string {
        return new Complex(this).toString();
    }

    dist(p: ImplicitVec | number, y?: number): number {
        let vs = unifyVector(p, y);
        return +math.distance(this.arr, vs.arr);
    }

    transform(m: ImplicitMat): Vec {
        let mU = mat(m);
        return mU.apply(this);
    }

}


