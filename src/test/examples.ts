import { vec } from "../lib";
import { turn } from "../lib/internal/angles";

let vec1 = vec(0, 100);

let vec2 = vec([0, 50])

let vec3 = vec({
    x: 10,
    y: -5
});

let vec3rotated = vec3.rotate(turn(0.5));

let u = vec3rotated.add(vec3);

let v = vec1.add([1, 2]);

console.log(v.zstring());
