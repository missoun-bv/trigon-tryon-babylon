import type { Transformation } from "./transformation-matrix";
import { FaceCanonicalModel } from "./face/face-model";
import type { Mesh, Mode } from "../types/types";

import type { Scene } from "./domain";
import { CAMERA_FAR, CAMERA_FOV, CAMERA_NEAR } from "./constants";
import { TrigonRenderer } from "./trigon-renderer";

//todo: add a loader to specify the parameters of the ar tryon model
export class TrigonARFace {
    private _trigon: TrigonRenderer;
    private _mode: Mode;
    private _video: HTMLVideoElement | undefined;

    constructor(trigon: TrigonRenderer, mode: Mode) {
        this._trigon = trigon;
        this._mode = mode;
    }

    start(video: HTMLVideoElement, scene: Scene) {
        this._video = video;
        this._video.style.position = "absolute";
        const camera = {
            fov: CAMERA_FOV,
            near: CAMERA_NEAR,
            far: CAMERA_FAR,
        };

        this._trigon.initScene(video, camera);
        //todo: move the face load outside in the loader
        const url =
            "https://d2snpszghqbaax.cloudfront.net/34b5763a-1541-4937-ba2d-3ae9a7f6299d";
       // this._trigon.loadOccluder({
       //     name: "occluder",
       //     url: url.concat("/occluders/headOccluder.glb"),
       //     scale: [1, 1, 1],
       //     // position: [0, -1, 6],
       //     position: [0, 0, 0],
       // });

        this._trigon.loadEnvironmentMap({
            url: scene.environment.url,
            rotation: scene.environment.rotation || 0,
        });

        this._trigon.load3DModel(scene.model);

        //todo: move the face load outside in the loader
        if (this._mode === "debug") {
            const mesh = FaceCanonicalModel.getMesh();
            mesh.wireframe = {
                color: "#00FF00",
                enabled: true,
            };

            this._trigon.loadGeometry(mesh);
        }
    }

    stop() {
        this._trigon.disposeScene();
    }

    transform(matrix: Transformation) {
        this._trigon.transform(matrix);
    }

    // resize(width: number, height: number) {
    //   this._trigon.resize(width, height);
    // }

    loadGeometry(mesh: Mesh) {
        this._trigon.loadGeometry(mesh);
    }
}
