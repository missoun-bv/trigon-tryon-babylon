import type {
  SpotLight,
  PointLight,
  HemisphericLight,
  DirectionalLight,
} from "@babylonjs/core/Lights";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector2, Vector3, Vector4 } from "@babylonjs/core/Maths/math.vector";
import type {
  DefaultRenderingPipeline,
  FxaaPostProcess,
  HighlightsPostProcess,
  LensRenderingPipeline,
  PassPostProcess,
  SSAORenderingPipeline,
} from "@babylonjs/core/PostProcesses";
import type {
  TonemapPostProcess,
  ImageProcessingPostProcess,
  BlackAndWhitePostProcess,
  BlurPostProcess,
  ConvolutionPostProcess,
} from "@babylonjs/core/PostProcesses";

export class ColorThree extends Color3 {}

export class ColorFour extends Color4 {}

export class VectorTwo extends Vector2 {}

export class VectorThree extends Vector3 {}

export class VectorFour extends Vector4 {}

export type CameraPosition = {
  alphaDegrees: number;
  betaDegrees: number;
  radius: number;
};

export type VectorPosition = {
  x: number;
  y: number;
  z: number;
};

export type RenderingPipeline =
  | DefaultRenderingPipeline
  | SSAORenderingPipeline
  | LensRenderingPipeline;

export type PostProcessType =
  | ImageProcessingPostProcess
  | TonemapPostProcess
  | BlackAndWhitePostProcess
  | BlurPostProcess
  | ConvolutionPostProcess
  | FxaaPostProcess
  | HighlightsPostProcess
  | PassPostProcess;

export const ANTI_ALIASING = {
  fxaa: "FXAA",
  msaa: "MSAA",
} as const;
type ObjectAntiAliasingValues<T> = T[keyof T];
export type AntiAliasingType = ObjectAntiAliasingValues<typeof ANTI_ALIASING>;

export const DEPTH_OF_FIELD_EFFECT_BLUR_LEVEL = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
} as const;
type ObjectDepthOfFieldEffectBlurLevelValues<T> = T[keyof T];
export type DepthOfFieldEffectBlurLevelType =
  ObjectDepthOfFieldEffectBlurLevelValues<
    typeof DEPTH_OF_FIELD_EFFECT_BLUR_LEVEL
  >;

export const TONEMAPPING_OPERATOR = {
  Hable: "Hable",
  Reinhard: "Reinhard",
  HejiDawson: "HejiDawson",
  Photographic: "Photographic",
} as const;
type ObjectToneMapValues<T> = T[keyof T];
export type TonemappingOperatorType = ObjectToneMapValues<
  typeof TONEMAPPING_OPERATOR
>;

export const CONVOLUTION_OPERATOR = {
  EmbossKernel: "EmbossKernel",
  SharpenKernel: "SharpenKernel",
  EdgeDetect0Kernel: "EdgeDetect0Kernel",
  EdgeDetect1Kernel: "EdgeDetect1Kernel",
  EdgeDetect2Kernel: "EdgeDetect2Kernel",
  GaussianKernel: "GaussianKernel",
} as const;
type ObjectConvolutionValues<T> = T[keyof T];
export type ConvolutionOperatorType = ObjectConvolutionValues<
  typeof CONVOLUTION_OPERATOR
>;

export type LightAssets =
  | DirectionalLight
  | HemisphericLight
  | PointLight
  | SpotLight;

export const LIGHTS = {
  POINT_LIGHT: "point-light",
  DIRECTIONAL_LIGHT: "directional-light",
  HEMISPHERIC_LIGHT: "hemispheric-light",
  SPOT_LIGHT: "spot-light",
} as const;
type ObjectLightAssetValues<T> = T[keyof T];
export type LightAssetsLightType = ObjectLightAssetValues<typeof LIGHTS>;

/**
 * @param {number} degrees
 * @returns {number}
 * @description Convert degrees to radians
 * @example degreesToRadians(90) // 1.5707963267948966
 */
const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * @param {number} degrees
 * @returns {number}
 * @description Convert radians to degrees
 * @example radiansToDegrees(1.5707963267948966) // 90
 */
const radiansToDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

export { degreesToRadians, radiansToDegrees };
