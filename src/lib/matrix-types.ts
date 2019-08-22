// A 2x3 transformation matrix in a 6-element array format.
// A 2x3 transformation matrix format whose topmost row is `[a, c, tx]`.
// 2x3 transformation matrix format whose topmost row vector is `[a, c, e]`.
import { Mat } from "./internal/mat";

export interface AceMatrix {
    // Element a₁₁
    a: number;
    // Element a₂₁
    b: number;
    // Element a₁₂
    c: number;
    // Element a₂₃
    d: number;
    // Element a₁₃
    e: number;
    // Element a₂₃
    f: number;
}

export interface ActxMatrix {
    // Element a₁₁
    a: number;
    // Element a₂₁
    b: number;
    // Element a₁₂
    c: number;
    // Element a₂₃
    d: number;
    // Element a₁₃
    tx: number;
    // Element a₂₃
    ty: number;
}

export interface MxyMatrix {
    m11: number;
    m12: number;
    m13: number;
    m21: number;
    m22: number;
    m23: number;

}

export type LinearArrayMatrix = [number, number, number, number, number, number];
export type RowArrayMatrix = [[number, number, number], [number, number, number]];
export type ColArrayMatrix = [[number, number], [number, number], [number, number]];
export type SquareRowArrayMatrix = [[number, number, number], [number, number, number], [number, number, number]];

export type ImplicitMat = LinearArrayMatrix | RowArrayMatrix | SquareRowArrayMatrix | ColArrayMatrix | Partial<ActxMatrix> | Partial<AceMatrix> | Partial<MxyMatrix> | Mat;
