import { Vec, VecModule } from "../vectors";
import { Rad } from "../angles";
import math = require("mathjs");
import { ImplicitMat } from "../matrix";
import { Mats } from "./mat-module.impl";
import { CartesianComplex, CartesianPoint, ImplicitVec, PolarPoint } from "../convertible-vector-types";

const Complex = require("complex.js");


export class VecModuleImpl{
    point(x: number, y: number) {
        return new VecImpl(x, y);
    }

    polar(r: number, phi: number) {
        return new VecImpl(Math.cos(phi) * r, Math.sin(phi) * r);
    }

    from(a, b?) {
        return unifyVector(a, b);
    }
}

export const Vecs = new VecModuleImpl() as VecModule;

export function unifyVector(a: ImplicitVec, b?: number) {
    if (a instanceof VecImpl) {
        return new VecImpl(a.x, a.y);
    } else if (typeof a === "number") {
        if (typeof b === "number") {
            return new VecImpl(a, b);
        } else {
            return new VecImpl(a, a);
        }
    } else if (Array.isArray(a)) {
        return new VecImpl(a[0], a[1]);
    } else if (a.hasOwnProperty("x")) {
        let p = a as CartesianPoint;
        return new VecImpl(p.x, p.y);
    } else if (a.hasOwnProperty("re")) {
        let z = a as CartesianComplex;
        if ((a as any).isInfinite) {

        }
        return new VecImpl(z.re, z.im);
    } else if (a.hasOwnProperty("phi")) {
        let z = a as PolarPoint;
        return new VecImpl(Math.cos(z.phi) * z.r, Math.sin(z.phi) * z.r);
    }
    throw new Error("Not a unknown vector, complex, or point type.");
}

export class VecImpl implements Vec {
    constructor(public x: number, public y: number) {

    }

    get arr() {
        return [this.x, this.y] as [number, number];
    }

    get complex() {
        return {
            re: this.x,
            im: this.y
        };
    }

    get polar() {
        return {
            phi: this.angle(),
            r: this.len
        };
    }

    get im() {
        return this.y;
    }

    get re() {
        return this.x;
    }

    get isZero() {
        return !!(math.isZero(this.x) && math.isZero(this.y));
    }

    get len() {
        return +math.norm(this.arr);
    }

    get simple() {
        return {
            x: this.x,
            y: this.y
        };
    }

    get unit() {
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
        return this.zmul(Vecs.polar(1, theta));
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

    get neg() {
        return unifyVector(-this.x, -this.y);
    }

    get as3() {
        return [this.x, this.y, 1] as any;
    }

    zconj(): Vec {
        return Vecs.point(-this.x, this.y);
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
ve
    zstring(): string {
        return new Complex(this).toString();
    }

    dist(p: ImplicitVec | number, y?: number): number {
        let vs = unifyVector(p, y);
        return +math.distance(this.arr, vs.arr);
    }

    transform(m: ImplicitMat): Vec {
        let mU = Mats.from(m);
        return mU.apply(this);
    }

}
