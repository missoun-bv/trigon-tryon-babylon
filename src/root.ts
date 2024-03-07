import { FacePose } from "./lib/ar/face/face-pose";
import "./style.css";
import { ARCamera } from "./lib/ar/ar-camera";
import { TrigonARFace } from "./lib/ar/trigon-ar-face";
import { TrigonRenderer } from "./lib/ar/trigon-renderer";
import { matrixDataToMatrix } from "@mediapipe/face_mesh";
import { Matrix } from "./lib/types/types";
import { Transformation } from "./lib/ar/transformation-matrix";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div class="action">
  <button id='tryon'>Try On</button>
  <button id='stop'>Stop</button>
</div>
<div class="container" >
  <video class="input_video"> </video>
</div>
`;
const videoElement = document.getElementsByClassName(
    "input_video",
)[0] as HTMLVideoElement;

const container = document.getElementsByClassName(
    "container",
)[0] as HTMLDivElement;
videoElement.style.position = "absolute";
videoElement.width = container.offsetWidth;
console.log(videoElement.width);
console.log(container.offsetWidth);

const tryon = document.getElementById("tryon");
const stop = document.getElementById("stop");
const url = import.meta.env.VITE_ASSET_URL;

const camera = new ARCamera(videoElement, {
    onFrame: async () => {
        await facePose.send({ image: videoElement });
    },
    facingMode: "user",
    width: container.offsetWidth,
});

const faceAR = new TrigonARFace(new TrigonRenderer(), "prod");

const facePose = new FacePose((faceGeometry) => {
    const matrixData = faceGeometry.getPoseTransformMatrix();
    const poseMatrix = matrixDataToMatrix(matrixData) as Matrix<number, 4, 4>;
    //! Todo add later

    const geo = new Transformation(poseMatrix);
    faceAR.transform(geo);
    const vt = Array.from(faceGeometry.getMesh().getVertexBufferList());
    let result = [];
    for (let i = 0; i < vt.length; i += 5) {
        result.push(...vt.slice(i, i + 3));
    }
});

tryon?.addEventListener("click", async () => {
    // console.log("Hello from your main file", camera);
    await camera.start();
    faceAR.start(videoElement, {
        environment: {
            url: url.concat("/hdrs/kloofendal_48d_partly_cloudy_puresky_1k.hdr"),
            rotation: 0,
        },
        model: {
            name: "eyewear",
            //url: "http://localhost:3000/moto/scene.gltf"
            url: url.concat("/models/scene.gltf"),
            scale: [10, 10, 10], //[102, 90, 110],
            position: [0, 0.1, 0], //[0, -10.5, -4.2],
        },
        light: {
            color: "#ffffff",
            intensity: 1,
        },
    });
});

stop?.addEventListener("click", () => {
    camera.stop();
    faceAR.stop();
});

