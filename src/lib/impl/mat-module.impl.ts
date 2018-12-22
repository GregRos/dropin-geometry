import { MatModule } from "../mat-module";
import { MatImpl, unifyMatrix } from "./mat.impl";
import { ImplicitMat, Mat } from "../matrix";
import { Rad } from "../angles";
import { Vec } from "../vectors";
import { Vecs } from "./vec.impl";
import { ImplicitVec } from "../convertible-vector-types";


export class MatModuleImpl implements MatModule{

    get id() {
        return unifyMatrix(
            1, 0, 0,
            0, 1, 0
        );
    }

    get zero() {
        return unifyMatrix(0, 0, 0, 0, 0, 0);
    }

    dilate(center: ImplicitVec, ratio: number): Mat {
        return undefined;
    }

    from(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number): Mat;
    from(m: ImplicitMat): Mat;
    from(m11: number | ImplicitMat, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number): Mat {
        return unifyMatrix(m11, m12, m13, m21, m22, m23);
    }

    reflect(v: ImplicitVec, origin?: ImplicitVec): Mat {
        let vU = Vecs.from(v);
        let angle = vU.angle();
        let pureReflection = this.from(
            Math.cos(2 * angle), Math.sin(2 * angle), 0,
            Math.sin(2 * angle), -Math.cos(2 * angle), 0
        );
        if (!origin) return pureReflection;
        let t = this.translate(origin);

        return t.compose(pureReflection).anticompose(t);
    }

    rotate(theta: Rad, origin?: ImplicitVec): Mat {
        let pureRotation = this.from(
            Math.cos(theta), -Math.sin(theta), 0,
            Math.sin(theta), Math.cos(theta), 0
        );
        if (!origin) return pureRotation;
        let t = this.translate(origin);
        return t.compose(pureRotation).anticompose(t);
    }

    scale(v: ImplicitVec, origin?: ImplicitVec): Mat {
        let vU = Vecs.from(v);
        let pureScale = this.from(
            vU.x, 0, 0,
            0, vU.y, 0
        );
        if (!origin) return pureScale;

        let t= this.translate(origin);
        return t.compose(pureScale).anticompose(t);
    }

    shear(v: ImplicitVec, origin?: ImplicitVec): Mat {
        let vU = Vecs.from(v);

        let pureShear = this.from(
            0, vU.y, 0,
            vU.x, 0, 0
        );

        let t = this.translate(origin);

        return t.compose(pureShear).anticompose(t);
    }

    translate(v: ImplicitVec): Mat {
        let vU = Vecs.from(v);
        return this.from(
            0, 0, vU.x,
            0, 0, vU.y
        );
    }

    skew(v: ImplicitVec, origin?: ImplicitVec): Mat {
        let vU = Vecs.from(v);
        return this.shear(Vecs.from(Math.tan(vU.x), Math.tan(vU.y)), origin);
    }
}

export const Mats = new MatModuleImpl() as MatModule;
