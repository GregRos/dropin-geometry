import mathjs = require("mathjs");

export type Rad = number;
export type Deg = number;
export type Turn = number;

export const deg = (deg: Deg): Rad => (deg / 360) * mathjs.tau;
export const turn = (turn: Turn): Rad => turn * mathjs.tau;
export const todeg = (rad: Rad): Deg => (rad * 360) / mathjs.tau;
export const toturn = (rad: Rad): Turn => rad / mathjs.tau;
