import {
    ImplicitMat,
    Mat} from "../matrix";
import math = require("mathjs");
import { Vec } from "../vectors";
import { Vecs } from "./vec.impl";
import { Rad } from "../angles";
import { Mats } from "./mat-module.impl";
import {
    AceMatrix,
    ActxMatrix,
    ColArrayMatrix,
    LinearArrayMatrix,
    MxyMatrix,
    RowArrayMatrix
} from "../convertible-matrix-types";
import { ImplicitVec } from "../convertible-vector-types";

function mapSame<T extends U[], U>(x: T, f: (x: U) => U) {
    return x.map(f) as T;
}

function mapToArrayTo0<T extends number[]>(x: T): T {
    return x.map(mapTo0) as T;
}

function mapTo0(x) {
    return x || 0;
}

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}
/* tslint:disable naming-convention */
export function unifyMatrix(inp: ImplicitMat | number, ...args: number[]): Mat {
    if (args.length > 0) {
        inp = [].slice.call(arguments);
    }
    if (typeof inp === "number") {
        throw new Error("What?");
    }
    if (inp instanceof MatImpl) {
        return new MatImpl(inp.m11, inp.m12, inp.m13, inp.m21, inp.m22, inp.m23);
    }
    else if (Array.isArray(inp)) {
        if (inp.length === 3 && inp[0].length === 3) {
            let lastRow = inp[2];
            if (!math.equal(lastRow, [0, 0, 1])) {
                throw new Error("A square 3x3 matrix input must be in row format, with the final row being [0, 0, 1].")
            }
            inp.pop();
        }
        if (inp.length === 6) {
            return new MatImpl(inp[0] || 0, inp[1] || 0, inp[2] || 0, inp[3] || 0, inp[4] || 0, inp[5] || 0);
        }
        else if (inp.length === 3 && inp[0].length === 2) {
            return new MatImpl(inp[0][0] || 0, inp[1][0] || 0, inp[2][0] || 0, inp[0][1] || 0, inp[1][1] || 0, inp[2][1] || 0);
        }
        throw new Error("Array of unknown size.");
    }
    else if ("tx" in inp) {
        return new MatImpl(inp.a || 0, inp.c || 0, inp.tx || 0, inp.b || 0, inp.d || 0, inp.ty || 0);
    }
    else if ("e" in inp) {
        return new MatImpl(inp.a || 0, inp.c || 0, inp.e || 0, inp.b || 0, inp.d || 0, inp.f || 0);
    }
    else if ("m11" in inp) {
        return new MatImpl(inp.m11 || 0, inp.m12 || 0, inp.m13 || 0, inp.m21 || 0, inp.m22 || 0, inp.m23 || 0);
    }
    throw new Error("Unknown object");
}

export class MatModuleImpl {

}

export class MatImpl implements Mat{
    constructor(
        public m11: number,
        public m12: number,
        public m13: number,
        public m21: number,
        public m22: number,
        public m23: number
    ) {

    }

    get ace() {
        return {
            a: this.m11,
            b: this.m21,
            c: this.m12,
            d: this.m22,
            e: this.m13,
            f: this.m23
        };
    }

    get actx() {
        return {
            a: this.m11,
            b: this.m21,
            c: this.m12,
            d: this.m22,
            tx: this.m13,
            ty: this.m23
        };
    }

    get cols() {
        return [
            [this.m11, this.m21],
            [this.m12, this.m22],
            [this.m13, this.m23]
        ] as ColArrayMatrix;
    }

    get rows() {
        return [
            [this.m11, this.m12, this.m13],
            [this.m21, this.m22, this.m23]
        ] as RowArrayMatrix;
    }

    get linear() {
        return [
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23
        ] as LinearArrayMatrix;
    }

    get asSquare() {
        let rows = this.rows as any;
        rows.push([0, 0, 1]);
        return rows;
    }

    get det() {
        return math.det(this.rows);
    }

    get m() {
        return {
            m11: this.m11,
            m21: this.m21,
            m12: this.m12,
            m22: this.m22,
            m13: this.m13,
            m23: this.m23
        } as MxyMatrix;
    }

    add(m: ImplicitMat): Mat {
        let mU = unifyMatrix(m);
        return unifyMatrix(math.add(this.rows, mU.rows) as RowArrayMatrix);
    }

    apply(v: ImplicitVec): Vec {
        let vec = Vecs.from(v);
        return Vecs.from(math.multiply(this.asSquare, vec.as3) as any);
    }

    backcompose(m: ImplicitMat): Mat {
        let mU = unifyMatrix(m);
        return unifyMatrix(math.multiply(mU.asSquare, this.asSquare) as RowArrayMatrix);
    }

    clamp(min?: number, max?: number): Mat {
        let mat = unifyMatrix(
            clamp(this.m11, min, max),
            clamp(this.m12, min, max),
            clamp(this.m13, min, max),
            clamp(this.m21, min, max),
            clamp(this.m22, min, max),
            clamp(this.m23, min, max)
        );
        return mat;
    }

    compose(m: ImplicitMat): Mat {
        let mU = unifyMatrix(m);
        return unifyMatrix(math.multiply(this.rows, mU.rows) as RowArrayMatrix);
    }

    div(m: ImplicitMat): Mat {
        let mU = unifyMatrix(m);
        return unifyMatrix(math.divide(this.rows, mU.rows) as RowArrayMatrix);
    }

    get(i, j): number {
        switch (i << 4 | j) {
            case 0 | 0:
                return this.m11;
            case 1 << 4 | 0:
                return this.m21;
            case 0 | 1:
                return this.m12;
            case 0 | 2:
                return this.m13;
            case 1 << 4 | 1:
                return this.m22;
            case 1 << 4 | 2:
                return this.m23;
        }
        return NaN;
    }

    invert(): Mat | null {
        let rows = this.asSquare;
        let r = math.inv(rows) as RowArrayMatrix;
        return unifyMatrix(r as RowArrayMatrix);
    }

    mult(m: ImplicitMat): Mat {
        let mU = unifyMatrix(m);
        return unifyMatrix(math.dotMultiply(this.rows, mU.rows) as RowArrayMatrix);
    }

    rotate(theta: Rad, origin?: ImplicitVec): Mat {
        return this.compose(Mats.rotate(theta, origin));
    }

    scale(v: ImplicitVec, origin?: ImplicitVec): Mat {
        return this.compose(Mats.scale(v, origin));
    }

    skew(v: ImplicitVec, origin?: ImplicitVec): Mat {
        return this.compose(Mats.skew(v, origin));
    }

    sub(m: ImplicitMat): Mat {
        let mU = unifyMatrix(m);
        return unifyMatrix(math.subtract(this.rows, mU.rows) as RowArrayMatrix);
    }

    translate(v: ImplicitVec): Mat {
        return this.compose(Mats.translate(v));
    }

    anticompose(m: ImplicitMat): Mat {
        let mU = unifyMatrix(m);
        return this.compose(mU.invert());
    }

}
