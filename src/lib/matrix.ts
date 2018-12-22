import { Vec } from "./vectors";
import { Rad } from "./angles";
import {
    AceMatrix,
    ActxMatrix,
    ColArrayMatrix,
    LinearArrayMatrix,
    MxyMatrix,
    RowArrayMatrix,
    SquareRowArrayMatrix
} from "./convertible-matrix-types";
import { ImplicitVec } from "./convertible-vector-types";

export type ImplicitMat = LinearArrayMatrix | RowArrayMatrix | SquareRowArrayMatrix | ColArrayMatrix | Partial<ActxMatrix> | Partial<AceMatrix> | Partial<MxyMatrix> | Mat;


/**
 * A 3x3 matrix whose last row vector is [0, 0, 1], leaving a configurable 2x3 matrix.
 * Defines a 2d affine transformation.
 */
export interface Mat extends MxyMatrix {

    // Gets m[x, y].
    get(i: number, j: number): number;
    readonly actx: ActxMatrix;
    readonly ace: AceMatrix;
    readonly asSquare: [[number, number, number], [number, number, number], [number, number, number]];
    readonly linear: LinearArrayMatrix;
    readonly cols: ColArrayMatrix;
    readonly rows: RowArrayMatrix;
    readonly m: MxyMatrix;

    // Calculates this (v)
    apply(v: ImplicitVec): Vec;

    // Calculates this (m)
    compose(m: ImplicitMat): Mat;

    // Calculates m (this)
    backcompose(m: ImplicitMat): Mat;

    // Evaluate `this (m⁻¹)`.
    anticompose(m: ImplicitMat): Mat;

    // Composes `this (translate(v))`.
    translate(v: ImplicitVec): Mat;

    // Composes with a rotation by `theta` radians around `origin`.
    rotate(theta: Rad, origin?: ImplicitVec): Mat;

    // Composes with a shear by `v` relative to `origin`.
    skew(v: ImplicitVec, origin?: ImplicitVec): Mat;

    // Composes with a non-uniform scaling by `v` relative to `origin`.
    scale(v: ImplicitVec, origin?: ImplicitVec): Mat;

    // Entrywise product with `m`, i.e. for each cell, perform `thisᵢⱼ · mᵢⱼ`. Also called Hadamard product.
    mult(m: ImplicitMat): Mat;

    // Entrywise division with `m`, i.e. for each cell, perform `thisᵢⱼ ÷ mᵢⱼ`. Also called Hadamard division.
    div(m: ImplicitMat): Mat;

    // Clamp each cell `thisᵢⱼ` to the closed interval `[min, max]`.
    clamp(min ?: number, max ?: number): Mat;

    // Calculates `this + m`.
    add(m: ImplicitMat): Mat;

    // Calculates `this - m`.
    sub(m: ImplicitMat): Mat;

    // Calculates the determinant of the 3x3 representation of `this`.
    readonly det: number;

    // Inverts the 3x3 representation of `this`. If it cannot be inverted, `null` is returned.
    invert(): Mat | null;
}
