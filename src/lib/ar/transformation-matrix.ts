import type { Matrix, Vector } from "../types/types";

export class Transformation {
  public matrix: Matrix<number, 4, 4>;

  constructor(matrix: Matrix<number, 4, 4>) {
    this.matrix = matrix;
  }

  public changeAxisBase(axis: Vector<1 | -1, 3>): Matrix<number, 4, 4> {
    const inversionMatrix = this.createInverisonMatrix(axis);
    // const mult = multiplyMatrices(inversionMatrix, this.matrix) as Matrix<
    //     number,
    //     4,
    //     4
    // >;
    const myInversion = this.leftToRightInversion(inversionMatrix) as Matrix<
      number,
      4,
      4
    >;
    return myInversion;
  }

  leftToRightInversion(baseMatrix: Matrix<number, 4, 4>): number[][] {
    const myInversion = [
      [baseMatrix[0][0], baseMatrix[2][0], baseMatrix[1][0], baseMatrix[3][0]],
      [baseMatrix[0][2], baseMatrix[2][2], baseMatrix[1][2], baseMatrix[3][0]],
      [baseMatrix[0][1], baseMatrix[2][1], baseMatrix[1][1], baseMatrix[3][0]],
      [baseMatrix[0][3], baseMatrix[2][3], baseMatrix[1][3], baseMatrix[3][0]],
    ];
    return myInversion;
  }
  private createInverisonMatrix(axis: Vector<1 | -1, 3>): Matrix<number, 4, 4> {
    console.log(axis);
    return [
      [axis[0], 0, 0, 0],
      [0, axis[1], 0, 0],
      [0, 0, axis[2], 0],
      [0, 0, 0, 1],
    ];
  }
}
