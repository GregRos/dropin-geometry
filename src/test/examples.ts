import {Angles} from "../lib/angles";
import { Vecs } from "../lib";

const {turn, deg, toturn, todeg} = Angles;

let vec1 = Vecs.from(0, 100);

let vec2 = Vecs.from([0, 50]);

let vec3 = Vecs.from({
    x: 10,
    y: -5
});

let vec3rotated = vec3.rotate(turn(0.5));

let u = vec3rotated.add(vec3);

let v = vec1.add([1, 2]);

