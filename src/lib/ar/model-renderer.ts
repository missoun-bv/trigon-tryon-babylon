import type { Mesh } from "../types/types";
import type { Camera, Environment, Model } from "./domain";
import type { Transformation } from "./transformation-matrix";

export interface ModelRenderer {
  //todo: refactor occluder using type model and occluder
  load3DModel(model: Model): Promise<void>;
  loadOccluder(model: Model): Promise<void>;
  loadGeometry(mesh: Mesh): void;
  loadEnvironmentMap(environment: Environment): void;
  initScene(camera: Camera): void;
  disposeScene(): void;
  transform(matrix: Transformation): void;
  // resize(width: number, height: number): void;
}
