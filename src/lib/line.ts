import { Vec } from "./vectors";
import { Rad } from "./angles";
import { ImplicitMat } from "./matrix";
import { ImplicitVec } from "./convertible-vector-types";

export type ImplicitLineSegment = LineSegment;

export interface LineSegment {
    readonly start: Vec;
    readonly end: Vec;

    readonly len: number;


    readonly slope: number;

    isInSegment(p: ImplicitVec): boolean;
    isInSegment(x: number, y: number): boolean;
    isInSegment(ls: ImplicitLineSegment): boolean;

    intersection(ls: ImplicitLineSegment): Vec;

    // Calculates the angle from `this` to `ls`, in radians, provided they intersect.
    angle(ls?: ImplicitLineSegment): number;




    transform(m: ImplicitMat): LineSegment;
}
