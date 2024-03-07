export function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const result: number[][] = [];
  if (a[0].length !== b.length) {
    throw new Error("incompatible matrices");
  }

  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < a[0].length; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function copyMatrix(matrix: number[][]): number[][] {
  const copy: number[][] = [];
  for (let i = 0; i < matrix.length; i++) {
    copy[i] = [...matrix[i]];
  }
  return copy;
}
