import { Rad } from "./internal/angles";
import { Vec } from "./internal/vec";

export interface PolarPoint {
    phi: Rad;
    r: number;
}

export interface CartesianComplex {
    re: number;
    im: number;
}

export type ArrayPoint = [number, number];

export interface CartesianPoint {
    x: number;
    y: number;
}

export type ImplicitVec = [number, number] | PolarPoint | CartesianPoint | CartesianComplex | number | Vec;
