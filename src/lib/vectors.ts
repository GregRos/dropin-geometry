import { Rad } from "./angles";
import { ImplicitMat } from "./matrix";
import { ArrayPoint, CartesianComplex, CartesianPoint, ImplicitVec, PolarPoint } from "./convertible-vector-types";

export interface VecModule {
    point(x: number, y: number): Vec;

    polar(r: number, phi: number): Vec;

    from(x: number, y: number): Vec;
    from(obj: ImplicitVec): Vec;
    from(obj: ImplicitVec | number, y?: number): Vec;
}

export interface Vec {

    readonly isNaN: boolean;

    readonly isInfinity: boolean;

    /**
     * Returns the `x` coordinate.
     */
    x: number;

    readonly polar: PolarPoint;

    // Calculate `(-x, -y)`.
    readonly neg: Vec;

    /**
     * Returns the `y` coordinate.
     */
    y: number;

    /**
     * Returns the `x` coordinate. Used to stand in as a ℂomplex number.
     */
    readonly re: number;

    /**
     * Returns the `y` coordinate. Used to stand in as a ℂomplex number.
     */
    readonly im: number;
    /**
     * Returns a normalized `this`.
     */
    readonly unit: Vec;
    /**
     * Returns the length of `this`, i.e. `‖this‖`.
     */
    readonly len: number;
    /**
     * "Exports" this vector as `[x, y]`.
     */
    readonly arr: ArrayPoint;

    readonly as3: [number, number, number];
    /**
     * "Exports" this vector as `{re: x, im: y}`
     */
    readonly complex: CartesianComplex;
    /**
     * "Exports" this vector as a flat object with `{x: x, y: y}`.
     */
    readonly simple: CartesianPoint;
    readonly isZero: boolean;

    /*
     * Lets you iterate over this using a `for .. of`, call `Array.from`, etc.
     */
    [Symbol.iterator](): Iterator<number>;

    /**
     * Calculates `this + (x, y)`
     */
    add(x: number, y: number);

    /**
     * Calculates `this + v`.
     * @param v
     */
    add(v: ImplicitVec): Vec;

    /**
     * Calculates `this - v`
     * @param v
     */
    sub(v: ImplicitVec): Vec;

    /**
     * Calculates `this - (x, y)`
     * @param x
     * @param y
     */
    sub(x: number, y: number): Vec;

    // Calculates `(this.x % v.x, this.y % v.y)`.
    mod(v: ImplicitVec): Vec;

    // Calculates `(this.x % x, this.y % y)`.
    mod(x: number, y: number): Vec;

    /**
     * Scale `this` by `v`. Equivalent to the elementwise product or Hadamard product, `this ∘ v`.
     */
    mul(v: ImplicitVec): Vec;

    /**
     * Scale `this` by `(x, y)`. Equivalent to the elementwise or Hadamard product, `this ∘ (x, y)`.
     */
    mul(x: number, y: number): Vec;

    /**
     * Scale `this` by `(this.x⁻¹, this.y⁻¹)`. Equivalent to the elementwise or Hadamard division, `this ⊘ (x, y)`.
     */
    div(v: ImplicitVec): Vec;

    /**
     *  Scale `this` by `(x⁻¹, y⁻¹)`. Equivalent to the elementwise or Hadamard division, `this ⊘ (x, y)`.
     */
    div(x: number, y: number): Vec;

    /**
     * Calculates the dot product between `this` and `(x, y)`.
     */
    dot(x: number, y: number): number;

    /**
     * Calculates the dot product between `this` and `f`
     */
    dot(v: ImplicitVec): number;

    /**
     * Calculates the angle from `this` to `v`, in rads. Defaults to horizontal angle.
     */
    angle(v?: ImplicitVec): Rad;

    /**
     * Calculates the angle from `this` to `(x, y)`, in rads.
     */
    angle(x: number, y: number): Rad;

    /**
     * Calculates the complex product `this · other`.
     * @param z
     */
    zmul(z: ImplicitVec): Vec;

    /**
     * Calculates the complex product `this · (x + iy)`.
     * @param x
     * @param y
     */
    zmul(x: number, y: number): Vec;

    /**
     * Calculates the complex division `this ÷ other`.
     * @param z
     */
    zdiv(z: ImplicitVec): Vec;

    /**
     * Calculates the complex division `this ÷ (x + iy)`
     */
    zdiv(x: number, y: number): Vec;

    /**
     * Calculates the complex conjugate of `this`
     */
    zconj(): Vec;

    /**
     * Calculates the complex exponentiation `this ** z`
     */
    zexp(z: ImplicitVec): Vec;

    /**
     * Calculates the complex exponentiation `this ** (x + iy)`.
     */
    zexp(x: number, y: number): Vec;

    /**
     * Calculates the principal complex logarithm of `this` in base `z` (defaults to natural).
     */
    zlog(z ?: ImplicitVec): Vec;

    /**
     * Calculates the principal complex logarithm of `this` in base `x + iy`.
     * @param x
     * @param y
     */
    zlog(x: number, y: number): Vec;

    /**
     * Calculates the complex (inverse) division `z ÷ this`. Reciprocal of `this.zdiv(z)`.
     * @param z
     */
    zdivs(z: ImplicitVec): Vec;

    /**
     * Calculates the complex inverse division `(x + iy) ÷ this`. Reciprocal of `this.zdiv(x, y)`.
     */
    zdivs(x: number, y: number): Vec;

    /**
     * Formats `this` as a ℂ number in the form: `x + iy`.
     */
    zstring(): string;

    /**
     * Rotates `this` around the origin by `angle` radians.
     * @param theta
     */
    rotate(theta: Rad): Vec;

    /**
     * Projects `this` to the unit vecotr of `v`.
     * @param v
     */
    proj(v: ImplicitVec): Vec;

    // Projects `this` to the unit vector of `(x, y)`.
    proj(x: number, y: number): Vec;

    /**
     * Reflects `this` around the axis created by the unit vector of `v`.
     * @param v
     */
    reflectAxis(v: ImplicitVec): Vec;

    /**
     * Returns a string representation of this vector as a point in ℝ², i.e. `"(x, y)"`.
     */
    toString(): string;

    /**
     * Returns a string representation of this vector as a sum of unit vectors in ℝ², i.e. `"ax̂ + bŷ"`
     */
    toVecString(): string;

    /**
     * Calculates the eucalidean distance between `this` and `p`, i.e. `‖this - p‖`
     */
    dist(p: ImplicitVec): number;

    // Calculates the eucalidean distance between `this` and `(x, y)`, i.e. `‖this - (x, y)‖`
    dist(x: number, y: number): number;

    /**
     * Returns the midpoint between `this` and `p`.
     */
    mid(p: ImplicitVec): Vec;

    // Returns the midpoint between `this` and `(x, y)`.
    mid(x: number, y: number): Vec;

    /**
     * Returns true if `this` and `other` have the same coordinates.
     */
    eq(v: ImplicitVec): boolean;

    // Returns `this = (x, y)`.
    eq(x: number, y: number): boolean;

    /**
     * Checks if `this` is parallel to `v`.
     * @param v
     */
    isCollinear(v: ImplicitVec): boolean;

    //Checks if `this` is parallel to `(x,y)`.
    isCollinear(x: number, y: number): boolean;

    /**
     * Checks if `this` is orthogonal to `v`.
     * @param v
     */
    isOrth(v: ImplicitVec): boolean;

    isOrth(x: number, y: number): boolean;

    transform(m: ImplicitMat): Vec;
}
