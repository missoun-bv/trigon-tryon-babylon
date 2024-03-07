import type { Mesh } from "../types/types";
import type { Transformation } from "./transformation-matrix";
import * as BABYLON from "@babylonjs/core";

import type { Camera, Environment, Model } from "./domain";
import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import type { AbstractMesh } from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { degreesToRadians } from "../utils";

import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Loading/loadingScreen.js";
import "@babylonjs/loaders/glTF/index.js";

export class TrigonRenderer {
    private _scene: Scene | undefined;
    private _engine: Engine | undefined;
    private _camera: BABYLON.ArcRotateCamera | undefined;

    constructor() { }

    createScene(video: HTMLVideoElement, container: HTMLElement) {
        // const engine = new Engine().createCanvas();
        const canvas = document.createElement("canvas");
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;
        canvas.style.position = "absolute";
        container.appendChild(canvas);
        this._engine = new Engine(canvas, true);
        if (!this._engine) throw new Error("Engine not initialized");
        const scene = new Scene(this._engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        this._scene = scene;
    }
    load3DModel(model: Model): void {
        this.loadModel(model);
        // this._scene!.setRenderingOrder(1);

        // this.loadModel(model);
        // gltf.scene.renderOrder = 1;
        // this._group.add(gltf.scene);
    }

    async loadOccluder(model: Model): Promise<void> {
        const meshes = await this.loadModel(model);
        const occluderMaterial = new BABYLON.StandardMaterial(
            "occluder",
            this.scene,
            //   colorWrite: false,
        );
        //     (o) => {
        //   if (o instanceof THREE.Mesh) {
        //     o.material = occluderMaterial;
        //   }
        // });
        // occluderMaterial.disableColorWrite = true;
        // occluderMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        meshes.forEach((o) => {
            if (o instanceof BABYLON.Mesh) {
                o.material = occluderMaterial;
            }
        });
        // gltf.scene.renderOrder = 0;
        // this._group.add(gltf.scene);
        // this._scene!.setRenderingOrder(0);
    }

    loadGeometry(mesh: Mesh) {
        if (!this._scene) throw new Error("Scene not initialized");
        if (!this._engine) throw new Error("Engine not initialized");
        const obj = this._scene.getMeshByName(mesh.name);
        if (obj) {
            obj.dispose();
        }
        const newMesh = new BABYLON.Mesh(mesh.name, this._scene);
        const material = new BABYLON.StandardMaterial("material", this._scene);
        const color = mesh.wireframe?.color || "#808080";
        const wireframe = mesh.wireframe?.enabled || false;

        material.diffuseColor = BABYLON.Color3.FromHexString(color);
        material.wireframe = wireframe;

        const geometry = new BABYLON.VertexData();
        geometry.indices = mesh.indexes;
        // const geometry = new THREE.BufferGeometry();
        // geometry.setIndex(mesh.indexes);

        const vts: Float32Array = new Float32Array(mesh.vertexes);

        // geometry.setAttribute("position", new THREE.BufferAttribute(vts, 3));
        geometry.positions = vts;

        if (mesh.uvs) {
            const uvs = new Float32Array(mesh.uvs);
            //   geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
            geometry.uvs = uvs;
        }
        geometry.applyToMesh(newMesh);
        newMesh.material = material;
        // newMesh.isCompletelyInFrustum = false;
        // const threeMesh = new THREE.Mesh(geometry, material);
        // threeMesh.frustumCulled = false;
        newMesh.isVisible = true;

        console.log("mesh", mesh);
        console.log("geometry", geometry);
    }
    disposeScene(): void {
        throw new Error("Method not implemented.");
    }

    loadEnvironmentMap(environment: Environment) {
        if (!this._scene) throw new Error("Scene not initialized");
        if (!this._engine) throw new Error("Engine not initialized");
        const environmentTexture = new BABYLON.HDRCubeTexture(
            environment.url,
            this._scene,
            128,
            false,
            true,
            false,
            true,
        );
        environmentTexture.rotationY = environment.rotation || 0;
        this._scene.environmentTexture = environmentTexture;
        // console.log("environmentTexture", environmentTexture);
    }

    initScene(video: HTMLVideoElement, camera: Camera) {
        // const cameraPosition = {
        //   alphaDegrees: 90,
        //   betaDegrees: 90,
        //   radius: 4,
        // } as CameraPosition;
        // const { alphaDegrees, betaDegrees, radius } = cameraPosition;
        //create renderer
        // this._renderer = new THREE.WebGLRenderer({
        //   alpha: true,
        //   antialias: true,
        // });
        // const canvasElement = document.getElementsByClassName(
        //   "canvas",
        // )[0] as HTMLCanvasElement;
        // const container = document.getElementsByClassName(
        //   "container",
        // )[0] as HTMLDivElement;
        const container = video.parentElement as HTMLElement;

        //create scene
        this.createScene(video, container);
        // this._renderer.setPixelRatio(window.devicePixelRatio);
        // this._renderer.domElement.style.position = "absolute";
        // this._renderer.setSize(video.clientWidth, video.clientHeight);

        // const container = video.parentElement as HTMLElement;
        // container.appendChild(this._renderer.domElement);

        // video.style.position = "absolute";

        //create light
        new BABYLON.HemisphericLight(
            "lightName",
            new BABYLON.Vector3(0, 0, 0),
            this.scene,
        );

        //create camera
        this._camera = new BABYLON.ArcRotateCamera(
            "camera",
            1, //check 0 after google
            1,
            2.5,
            new BABYLON.Vector3(0, 0, 0),
            this.scene,
        );
        // This targets the camera to scene origin
        this._camera.setTarget(BABYLON.Vector3.Zero());

        this._camera.attachControl();
        // this._camera.speed = 0.02;
        this._camera.fov = degreesToRadians(camera.fov);
        this._camera.minZ = camera.near;
        this._camera.maxZ = camera.far;

        // console.log("camera", this._camera.fov, this._camera.aspect);

        // this._camera.updateProjectionMatrix();
        // console.log("camera", this._camera.fov, this._camera.aspect);
        // this.animate();
        this.renderLoop();
    }

    //   disposeScene() {
    //     if (this._renderer) this._renderer.dispose();
    //   }

    //   resize(width: number, height: number) {
    //     if (!this._camera || !this._renderer) return;
    //     //console.log('camera resize', width, height);
    //     this._camera.aspect = width / height;
    //     this._camera.updateProjectionMatrix();

    //     this._renderer.setSize(width, height);
    //   }

    //todo refactor method passing a generic transformation matrix
    transform(matrix: Transformation) {
        if (!this._scene) throw new Error("Scene not initialized");
        if (!this._engine) throw new Error("Engine not initialized");
        console.log(matrix);

        //const pose = matrix.leftToRightInversion().flat(1);
        const pose = matrix.changeAxisBase([-1,1,1]).flat(1);
        // const pose = matrix.changeAxisBase([1, 1, 1]).flat(1);
        const transformationMatrix = this.createTransformationMatrix(pose);

        const translation = new BABYLON.Vector3();
        const scale = new BABYLON.Vector3();
        const rotation = new BABYLON.Quaternion();

        //! log everything
        // console.log(pose);
        // console.log(transformationMatrix);
        // console.log(rotation);
        // console.log(rotation);
        // console.log(scale);

        transformationMatrix.decompose(translation, rotation, scale);

        // let rotationMatrix = new THREE.Matrix4();
        // rotationMatrix.extractRotation(transformationMatrix);
        // let identity = new THREE.Matrix4();
        // identity.set(1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1);

        // rotationMatrix = rotationMatrix.multiply(identity);
        // identity = identity.invert();
        // rotationMatrix = rotationMatrix.multiply(identity.invert());
        // console.log('rotationMatrix', rotationMatrix);
        // const faceMesh = this._scene.getMeshByName("face");
        // const faceMesh = this._scene.meshes;
        // console.log("faceMesh", faceMesh);
        // faceMesh.forEach((o) => {
        //   if (o instanceof BABYLON.Mesh) {
        //     o.rotationQuaternion = rotation;
        //     o.position = translation;
        //     o.scaling = scale;
        //     o.position = translation;
        //     // o.updatePoseMatrix(transformationMatrix);
        //     // o.computeWorldMatrix(true);
        //   }
        // });
        // console.log(this._scene.rootNodes);

        this._scene.meshes[0].scaling = new BABYLON.Vector3(
            scale.x,
            scale.y,
            scale.z,
        );

        this._scene.meshes[0].rotation.applyRotationQuaternion(rotation);
        // //this._group.rotation.setFromRotationMatrix(rotationMatrix);

        this._scene.meshes[0].position.set(
            translation.x,
            translation.y,
            translation.z,
        );

        // this._scene.meshes[0].updatePoseMatrix(transformationMatrix);

        // this._scene.meshes[0].computeWorldMatrix(true);

        // const faceMesh = this._scene.getObjectByName('calculated_mesh');
        // const canonicalMesh = this._scene.getObjectByName('face');
        // if (faceMesh?.isObject3D && canonicalMesh?.isObject3D) {
        //   const faceVtx = (faceMesh as THREE.Mesh).geometry.getAttribute(
        //     'position'
        //   );
    }

    private async loadModel(model: Model): Promise<BABYLON.AbstractMesh[]> {
        const scene = await SceneLoader.AppendAsync(
            model.url,
            "",
            this._scene,
        );
        // check meshes[0] override scaling
        const meshes: AbstractMesh[] = scene.meshes
        meshes[0].name = model.name;
        // console.log("scene", this.scene);
        console.log(model.name, meshes);


        // const { meshes } = await SceneLoader.AppendAsync(model.url, "", this._scene);

        if (model.scale !== undefined) {

            meshes[0].scaling = new BABYLON.Vector3(
                model.scale[0],
                model.scale[1],
                model.scale[2],
            );
            console.log(meshes[0].scaling);

        }
        //   if (model.position)
        //     m.position = new BABYLON.Vector3(
        //       model.position[0],
        //       model.position[1],
        //       model.position[2],
        //     );
        // });
        //  if (model.scale !== undefined) {
        //      meshes[0].scaling = new BABYLON.Vector3(
        //          model.scale[0],
        //          model.scale[1],
        //          model.scale[2],
        //      );
        //  }
        if (model.position) {
            meshes[0].position = new BABYLON.Vector3(
                model.position[0],
                model.position[1],
                model.position[2],
            );
        }
        return meshes;
    }

    get scene() {
        return this._scene;
    }

    private createTransformationMatrix(pose: number[]): BABYLON.Matrix {
        const transformationMatrix = new BABYLON.Matrix();
        pose.forEach((p, index) => {
            transformationMatrix.addAtIndex(p, index);
        });
        // transformationMatrix.add(
        //   pose[0],
        //   pose[1],
        //   pose[2],
        //   pose[3],
        //   pose[4],
        //   pose[5],
        //   pose[6],
        //   pose[7],
        //   pose[8],
        //   pose[9],
        //   pose[10],
        //   pose[11],
        //   pose[12],
        //   pose[13],
        //   pose[14],
        //   pose[15],
        // );

        return transformationMatrix;
    }

    //   private animate() {
    //     if (this._renderer) {
    //       this._renderer.render(this._scene, this._camera!);
    //     }
    //   }

    /**
     * @description - Run the Babylon render loop with engine resize and auto camera update
     * @returns {void}
     */
    renderLoop(): void {
        if (!this._scene) throw new Error("Scene not initialized");
        if (!this._engine) throw new Error("Engine not initialized");
        this._engine.runRenderLoop(() => {
            requestAnimationFrame(() => {
                this._engine!.resize();
                this._scene!.render(true);
            });
        });
    }
}
