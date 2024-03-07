import type { CameraOptions } from "@mediapipe/camera_utils";

export class ARCamera {
  //   camera: ArcRotateCamera;
  private _videoElement: HTMLVideoElement;
  private _size: { width: number; height: number };
  private onFrame: () => Promise<void> | null;
  private _constraints = {
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      facingMode: "user",
    },
    audio: false,
  };

  constructor(video: HTMLVideoElement, options: CameraOptions) {
    this._videoElement = video;
    this._size = {
      width: options.width ?? this._constraints.video.width.ideal,
      height: options.height ?? this._constraints.video.height.ideal,
    };
    this._constraints.video.facingMode =
      options.facingMode ?? this._constraints.video.facingMode;
    this.onFrame = options.onFrame;
    this.onFrame = this.onFrame.bind(this);
    this.init();
  }

  async start(): Promise<void> {
    window.requestAnimationFrame(() => this.OnFrameHandler());
  }

  stop() {
    this._videoElement.pause();
  }

  private async OnFrameHandler(): Promise<void> {
    await this.onFrame();
    window.requestAnimationFrame(() => this.OnFrameHandler());
  }

  private async init(): Promise<void> {
    const constraints = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: "user",
      },
      audio: false,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream: MediaStream) => {
        this._videoElement.srcObject = stream;
        this._videoElement.setAttribute("playsinline", "true");
        this._videoElement.addEventListener("loadedmetadata", async () => {
          //if (this._size.width) this._videoElement.width = this._size.width;
          //if (this._size.height) this._videoElement.width = this._size.height;
        });

        this._videoElement.play();
      })
      .catch((err) => {
        console.log("getUserMedia error", err);
      });
  }
}
