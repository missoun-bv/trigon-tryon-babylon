import type { Vector } from "../types/types";

//todo import zod to create and validate types
export type Camera = {
  fov: number;
  near: number;
  far: number;
};

export type Light = {
  color: string;
  intensity?: number;
};

export type Model = {
  name: string;
  url: string;
  scale?: Vector<number, 3>;
  position?: Vector<number, 3>;
};

export type Environment = {
  url: string;
  rotation?: number;
};

export type Scene = {
  light: Light;
  environment: Environment;
  model: Model;
};
