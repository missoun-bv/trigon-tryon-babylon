export type Vector<T, N extends number> = [T, ...T[]] & {
  length: N;
};
export type Matrix<T, N extends number, M extends number> = Vector<
  Vector<T, M>,
  N
>;

export interface IEvent<TSender, TArgs> {
  subscribe(fn: (sender: TSender, args: TArgs) => void): void;
  unsubscribe(fn: (sender: TSender, args: TArgs) => void): void;
}

export type Mesh = {
  name: string;
  vertexes: number[];
  indexes: number[];
  uvs?: number[];
  wireframe?: {
    enabled: boolean;
    color: string;
  };
};

export type Mode = "prod" | "debug";
