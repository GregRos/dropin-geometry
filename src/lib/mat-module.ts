import { Rad } from "./angles";
import { Vec } from "./vectors";
import { ImplicitMat, Mat } from "./matrix";
import { ImplicitVec } from "./convertible-vector-types";

export interface MatModule {

    // Gets the identity matrix.
    readonly id: Mat;

    // Gets the zero matrix
    readonly zero: Mat;

    from(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number): Mat;
    from(m: ImplicitMat): Mat;

    // Rotation by `theta` radians around `origin`.
    rotate(theta: Rad, origin?: ImplicitVec): Mat;

    // Non-uniform scaling by mul vector `v` in relation to `origin`.
    scale(v: ImplicitVec, origin?: ImplicitVec): Mat;

    // Shear by shear vector `v` in relation to `origin`. Similar to `skew` but using cartesian coordinates.
    shear(v: ImplicitVec, origin?: ImplicitVec): Mat;

    // A shear transform with the vector `(tan(v.x), tan(v.y))`.
    skew(v: ImplicitVec, origin?: ImplicitVec): Mat;

    // Reflection around a line with direction `v` from an origin `origin`.
    reflect(v: ImplicitVec, origin?: ImplicitVec): Mat;

    // Translation by vector `v`.
    translate(v: ImplicitVec): Mat;

    // Dilation from `center` by `ratio`. Also called hypothety.
    dilate(center: ImplicitVec, ratio: number): Mat;


}
