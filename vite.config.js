import { defineConfig } from "vite";

import path from "path";
import * as fs from "fs";

export default defineConfig({
  build: {
    outDir: "dist",
    target: "esnext",
  },
  plugins: [
    {
      ...mediapipe_workaround(),
      enforce: "post",
      apply: "build",
    },
  ],
});

function mediapipe_workaround() {
  return {
    name: "mediapipe_workaround",
    load(id) {
      if (path.basename(id) === "face_mesh.js") {
        let code = fs.readFileSync(id, "utf-8");
        code += "exports.FaceMesh = FaceMesh;";
        code += "exports.matrixDataToMatrix = matrixDataToMatrix;";
        return { code };
      }
      if (path.basename(id) === "camera_utils.js") {
        let code = fs.readFileSync(id, "utf-8");
        code += "exports.Camera = Camera;";
        return { code };
      } else {
        return null;
      }
    },
  };
}
