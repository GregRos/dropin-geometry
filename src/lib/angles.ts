import mathjs = require("mathjs");

export type Rad = number;
export type Deg = number;
export type Grad = number;
export type Turn = number;

export type AngleUnit =
    "rad" |
    "grad" |
    "turn" |
    "deg";

/**
 * A suite of functions for converting an arbitrary angle measurement to other measurements.
 */
export interface AngleUnits<T extends number> {
    unit: AngleUnit;

    rad(angle: T): Rad;

    deg(angle: T): Deg;

    turn(angle: T): Turn;

    grad(angle: T): Grad;

    unrad(angle: Rad): T;

    string(angle: T): string;
}


export namespace Angles {
    export const rad: AngleUnits<Rad> = {
        deg: rad => (rad * 360) / mathjs.tau,
        turn: rad => rad / mathjs.tau,
        grad: rad => (rad * 400) / mathjs.tau,
        rad: rad => rad,
        unrad: rad => rad,
        unit: "rad",
        string: rad => `${rad} rad`
    };

    export const turn: AngleUnits<Turn> = {
        unit: "turn",
        deg: turn => turn * 360,
        turn: turn => turn,
        grad: turn => turn * 400,
        rad: turn => turn * mathjs.tau,
        unrad: rad.turn,
        string: turn => `${turn} tr`
    };

    export const deg: AngleUnits<Deg> = {
        unit: "deg",
        deg: deg => deg,
        turn: deg => deg / 360,
        grad: deg => (deg * 400) / 360,
        rad: deg => (deg * mathjs.tau) / 360,
        unrad: rad.deg,
        string: deg => `${deg}°`
    };

    export const grad: AngleUnits<Grad> = {
        unit: "grad",
        deg: grad => (grad * 400) / 360,
        turn: grad => grad / 400,
        rad: grad => (grad / 400) * mathjs.tau,
        unrad: rad.grad,
        string: grad => `${grad} gr`,
        grad: grad => grad,
    };
}

