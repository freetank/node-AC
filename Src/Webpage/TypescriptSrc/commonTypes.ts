
export type Pair<A, B> = [A, B];
export class Coordinate {
    x: number;
    y: number;
    z?: number;

    constructor(x: number, y: number, z?: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
};
export type Polygon = Coordinate[];
