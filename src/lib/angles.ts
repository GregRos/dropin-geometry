import mathjs = require("mathjs");

export type Rad = number;
export type Deg = number;
export type Grad = number;
export type Turn = number;

export const Angles = {
    deg: deg => (deg / 360) * mathjs.tau,
    turn: turn => turn * mathjs.tau,
    todeg: rad => (rad * 360 ) / mathjs.tau,
    toturn: rad => rad / mathjs.tau
};
