
import math = require("mathjs");
import { vec, Vec } from "./vec";
import { Rad } from "./angles";
import {
    AceMatrix,
    ActxMatrix,
    ColArrayMatrix, ImplicitMat,
    LinearArrayMatrix,
    MxyMatrix,
    RowArrayMatrix, SquareRowArrayMatrix
} from "../matrix-types";
import { ImplicitVec } from "../vector-types";

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}





export class Mat {
    constructor(
        public m11: number,
        public m12: number,
        public m13: number,
        public m21: number,
        public m22: number,
        public m23: number
    ) {

    }

    get ace(): AceMatrix {
        return {
            a: this.m11,
            b: this.m21,
            c: this.m12,
            d: this.m22,
            e: this.m13,
            f: this.m23
        };
    }

    get actx(): ActxMatrix {
        return {
            a: this.m11,
            b: this.m21,
            c: this.m12,
            d: this.m22,
            tx: this.m13,
            ty: this.m23
        };
    }

    get cols(): ColArrayMatrix {
        return [
            [this.m11, this.m21],
            [this.m12, this.m22],
            [this.m13, this.m23]
        ] as ColArrayMatrix;
    }

    get rows(): RowArrayMatrix {
        return [
            [this.m11, this.m12, this.m13],
            [this.m21, this.m22, this.m23]
        ] as RowArrayMatrix;
    }

    get linear(): LinearArrayMatrix {
        return [
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23
        ] as LinearArrayMatrix;
    }

    get asSquare(): SquareRowArrayMatrix {
        let rows = this.rows as any;
        rows.push([0, 0, 1]);
        return rows;
    }

    get det(): number {
        return math.det(this.rows);
    }

    get m(): MxyMatrix {
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
        let mU = mat(m);
        return mat(math.add(this.rows, mU.rows) as RowArrayMatrix);
    }

    apply(iv: ImplicitVec): Vec {
        let v = vec(iv);
        return vec(math.multiply(this.asSquare, v.as3) as any);
    }

    backcompose(m: ImplicitMat): Mat {
        let mU = mat(m);
        return mat(math.multiply(mU.asSquare, this.asSquare) as RowArrayMatrix);
    }

    clamp(min?: number, max?: number): Mat {
        let matx = mat(
            clamp(this.m11, min, max),
            clamp(this.m12, min, max),
            clamp(this.m13, min, max),
            clamp(this.m21, min, max),
            clamp(this.m22, min, max),
            clamp(this.m23, min, max)
        );
        return matx;
    }

    compose(m: ImplicitMat): Mat {
        let mU = mat(m);
        return mat(math.multiply(this.rows, mU.rows) as RowArrayMatrix);
    }

    div(m: ImplicitMat): Mat {
        let mU = mat(m);
        return mat(math.divide(this.rows, mU.rows) as RowArrayMatrix);
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
        return mat(r as RowArrayMatrix);
    }

    mult(m: ImplicitMat): Mat {
        let mU = mat(m);
        return mat(math.dotMultiply(this.rows, mU.rows) as RowArrayMatrix);
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
        let mU = mat(m);
        return mat(math.subtract(this.rows, mU.rows) as RowArrayMatrix);
    }

    translate(v: ImplicitVec): Mat {
        return this.compose(Mats.translate(v));
    }

    anticompose(m: ImplicitMat): Mat {
        let mU = mat(m);
        return this.compose(mU.invert());
    }

}
/* tslint:disable naming-convention */
function unifyMatrix(inp: ImplicitMat | number, ...args: number[]): Mat {
    if (args.length > 0) {
        inp = [].slice.call(arguments);
    }
    if (typeof inp === "number") {
        throw new Error("What?");
    }
    if (inp instanceof Mat) {
        return new Mat(inp.m11, inp.m12, inp.m13, inp.m21, inp.m22, inp.m23);
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
            return new Mat(inp[0] || 0, inp[1] || 0, inp[2] || 0, inp[3] || 0, inp[4] || 0, inp[5] || 0);
        }
        else if (inp.length === 3 && inp[0].length === 2) {
            return new Mat(inp[0][0] || 0, inp[1][0] || 0, inp[2][0] || 0, inp[0][1] || 0, inp[1][1] || 0, inp[2][1] || 0);
        }
        throw new Error("Array of unknown size.");
    }
    else if ("tx" in inp) {
        return new Mat(inp.a || 0, inp.c || 0, inp.tx || 0, inp.b || 0, inp.d || 0, inp.ty || 0);
    }
    else if ("e" in inp) {
        return new Mat(inp.a || 0, inp.c || 0, inp.e || 0, inp.b || 0, inp.d || 0, inp.f || 0);
    }
    else if ("m11" in inp) {
        return new Mat(inp.m11 || 0, inp.m12 || 0, inp.m13 || 0, inp.m21 || 0, inp.m22 || 0, inp.m23 || 0);
    }
    throw new Error("Unknown object");
}

export function mat(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number): Mat;
export function mat(m: ImplicitMat): Mat;
export function mat(m11: number | ImplicitMat, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number): Mat {
    return unifyMatrix(m11, m12, m13, m21, m22, m23);
}
export namespace Mats {
    export const id = mat(
        1, 0, 0,
        0, 1, 0
    );

    export const zero = mat(0, 0, 0, 0, 0, 0);

    export function dilate(center: ImplicitVec, ratio: number): Mat {
        return undefined;
    }

    export function reflect(v: ImplicitVec, origin?: ImplicitVec): Mat {
        let vU = vec(v);
        let angle = vU.angle();
        let pureReflection = mat(
            Math.cos(2 * angle), Math.sin(2 * angle), 0,
            Math.sin(2 * angle), -Math.cos(2 * angle), 0
        );
        if (!origin) return pureReflection;
        let t = translate(origin);

        return t.compose(pureReflection).anticompose(t);
    }

    export function rotate(theta: Rad, origin?: ImplicitVec): Mat {
        let pureRotation = mat(
            Math.cos(theta), -Math.sin(theta), 0,
            Math.sin(theta), Math.cos(theta), 0
        );
        if (!origin) return pureRotation;
        let t = translate(origin);
        return t.compose(pureRotation).anticompose(t);
    }

    export function scale(v: ImplicitVec, origin?: ImplicitVec): Mat {
        let vU = vec(v);
        let pureScale = mat(
            vU.x, 0, 0,
            0, vU.y, 0
        );
        if (!origin) return pureScale;

        let t= translate(origin);
        return t.compose(pureScale).anticompose(t);
    }

    export function shear(v: ImplicitVec, origin?: ImplicitVec): Mat {
        let vU = vec(v);

        let pureShear = mat(
            0, vU.y, 0,
            vU.x, 0, 0
        );

        let t = translate(origin);

        return t.compose(pureShear).anticompose(t);
    }

    export function translate(v: ImplicitVec): Mat {
        let vU = vec(v);
        return mat(
            0, 0, vU.x,
            0, 0, vU.y
        );
    }

    export function skew(v: ImplicitVec, origin?: ImplicitVec): Mat {
        let vU = vec(v);
        return shear(vec(Math.tan(vU.x), Math.tan(vU.y)), origin);
    }

}
