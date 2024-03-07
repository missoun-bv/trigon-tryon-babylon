import type { Mesh } from "../../types/types";
import { positions, indexes, uvs } from "./canonical-face-model";

export class FaceCanonicalModel {
  static getMesh(): Mesh {
    return {
      name: "face",
      vertexes: positions.flat(1),
      uvs: uvs.flat(1),
      indexes: [...indexes],
    };
  }
}
