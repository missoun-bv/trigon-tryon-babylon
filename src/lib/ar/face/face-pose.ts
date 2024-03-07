import type { FaceGeometry, InputMap, Results } from "@mediapipe/face_mesh";
import {
  FaceMesh,
  // matrixDataToMatrix,
} from "@mediapipe/face_mesh";

import { TypedEvent } from "../../types/events";
import { Transformation } from "../transformation-matrix";
// import { Matrix } from '../types/types';
// import { Transformation } from '../ar/transformation-matrix';

interface FacePoseOptions {
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}

const onFacePoseChanged = new TypedEvent<FaceGeometry>();

export class FacePose {
  public faceMesh: FaceMesh;
  public readonly options: FacePoseOptions;
  
  constructor(
    onResults: (faceGeometry: FaceGeometry) => void,
    options: FacePoseOptions = {
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    },
  ) {
    onFacePoseChanged.on(onResults);
    this.options = options;
    this.faceMesh = this.initFaceMesh();
  }

  public async send(frame: InputMap) {
    await this.faceMesh.send(frame);
  }

  public async close() {
    this.faceMesh.close();
  }

  public async reset() {
    this.faceMesh.reset();
  }

  private initFaceMesh() {
    const faceMesh = new FaceMesh({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false,
      enableFaceGeometry: true,
      minDetectionConfidence: this.options.minDetectionConfidence,
      minTrackingConfidence: this.options.minTrackingConfidence,
    });
    console.log(faceMesh);

    faceMesh.onResults(this.calculatePoseMatrix);

    return faceMesh;
  }

  private calculatePoseMatrix(results: Results) {
    if (results.multiFaceGeometry.length > 1)
      throw new Error("Only one face is supported");

    if (results.multiFaceGeometry.length === 0)
      console.log("At least one face is needed to calculate pose matrix");

    const face = results.multiFaceGeometry[0];
    // console.log(face);
    const matrixData = face.getPoseTransformMatrix();

    if (!matrixData) return;
    onFacePoseChanged.emit(face);
  }
}

//todo: rename to FacePose into FaceMesh
//todo: rename FaceGeometry to FacePose
