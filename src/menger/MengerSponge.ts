import { Mat3, Mat4, Vec3, Vec4 } from "../lib/TSM.js";

/* A potential interface that students should implement */
interface IMengerSponge {
  setLevel(level: number): void;
  isDirty(): boolean;
  setClean(): void;
  normalsFlat(): Float32Array;
  indicesFlat(): Uint32Array;
  positionsFlat(): Float32Array;
}

/**
 * Represents a Menger Sponge
 */
export class MengerSponge implements IMengerSponge {

  private dirty: boolean; // TODO: See when to set/unset this
  private vertexPositions: Float32Array;
  private faceIndices: Uint32Array;
  private vertexNormals: Float32Array;
  private level: number;
  // private printedBefore = false;
  
  constructor(level: number) {
    // this.vertexPositions = new Float32Array([1.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
    // this.faceIndices = new Uint32Array([0, 1, 2]);
    // this.vertexNormals = new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0]);
    this.level = -1;
    this.setLevel(level);
    // console.log(this.faceIndices);
    // console.log(this.vertexPositions);
    // console.log(this.vertexNormals);
  }

  /**
   * Returns true if the sponge has changed.
   */
  public isDirty(): boolean {
       return this.dirty;
  }

  public setClean(): void {
    this.dirty = false; // TODO: See whether this is enough, or we need to do other stuff before unsetting dirty
  }
  
  public setLevel(level: number)
  {
	  if (this.level == level) {
      return;
    }
    this.vertexPositions = new Float32Array(0);
    this.faceIndices = new Uint32Array(0);
    this.vertexNormals = new Float32Array(0);
    this.level = level;
    // It's a cube, so we don't need full min and max vertices, only one of the two vertices and the length should suffice.
    // this.createSponge(new Float32Array([-0.5,-0.5,-0.5]), new Float32Array([0.5,0.5,0.5]), level);
    this.createSponge(new Float32Array([-0.5,-0.5,-0.5]), 1, level);
    this.dirty = true; // TODO: Add other stuff here, but need to mark dirty for sure.
    // console.log(this.faceIndices.length);
    // console.log(this.vertexPositions);
  }

  /* Returns a flat Float32Array of the sponge's vertex positions */
  public positionsFlat(): Float32Array {
	  return this.vertexPositions;
  }

  /**
   * Returns a flat Uint32Array of the sponge's face indices
   */
  public indicesFlat(): Uint32Array {
    return this.faceIndices;
  }

  /**
   * Returns a flat Float32Array of the sponge's normals
   */
  public normalsFlat(): Float32Array {
	  return this.vertexNormals;
  }

  /**
   * Returns the model matrix of the sponge
   */
  public uMatrix(): Mat4 {

    // TODO: change this, if it's useful
    const ret : Mat4 = new Mat4().setIdentity();

    return ret;    
  }

  private createSponge(minCorner: Float32Array, cubeLength: number, level: number): void {
    if (level == 1) {
      // console.log(minCorner, maxCorner);
      // if (maxCorner[0]==0.5) {
        // console.trace();
      // }
      // console.log(maxCorner);
      this.addCube(minCorner, new Float32Array([minCorner[0]+cubeLength, minCorner[1]+cubeLength, minCorner[2]+cubeLength]));
    }
    else {
      let smallCubeLength = cubeLength/3.0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          for (let k = 0; k < 3; k++) {
            // Skip the middle cubes
            if ((i===1 && j===1) || (j===1 && k===1) || (k===1 && i===1)) {
              continue;
            }
            let newMin = new Float32Array([(minCorner[0] + smallCubeLength*i), (minCorner[1] + smallCubeLength*j), (minCorner[2] + smallCubeLength*k)]);
            // let newMax = new Float32Array([(maxCorner[0] - smallCubeLength[0]*(2-i)), (maxCorner[1] - smallCubeLength[1]*(2-j)), (maxCorner[2] - smallCubeLength[2]*(2-k))]);
            // let newMax = new Float32Array([newMin[0]+smallCubeLength[0], newMin[1]+smallCubeLength[1], newMin[2]+smallCubeLength[2]]);
            this.createSponge(newMin, smallCubeLength, level-1);

            // if (level == 2 && !this.printedBefore) {
            //   console.log (newMin, newMax);
            // }
          }
        }
      }
      // if (level == 2) {
      //   this.printedBefore = true;
      // }
    }
  }

  private addCube(minCorner: Float32Array, maxCorner: Float32Array): void {
    // We're dealing w homogeneous coordinates, so 4 coords per vertex.
    // Worked out faces and vertices on the ipad - add those here to corresponding arrays, also need to add normals
    // See how to add to TypedArrays

    // TODO: Can probably optimize to 24 instead of 36 since triangles on the same face should be able to share the vertices, so 4 vertices per face, not 6
    let tempVertices: Float32Array = new Float32Array(this.vertexPositions.length + 36*4);
    let tempNormals: Float32Array = new Float32Array(this.vertexNormals.length + 36*4);
    let tempFaces: Uint32Array = new Uint32Array(this.faceIndices.length + 12*3);

    let vert1 = new Float32Array([minCorner[0], minCorner[1], minCorner[2], 1.0]);
    let vert2 = new Float32Array([minCorner[0], minCorner[1], maxCorner[2], 1.0]);
    let vert3 = new Float32Array([minCorner[0], maxCorner[1], minCorner[2], 1.0]);
    let vert4 = new Float32Array([minCorner[0], maxCorner[1], maxCorner[2], 1.0]);
    let vert5 = new Float32Array([maxCorner[0], minCorner[1], minCorner[2], 1.0]);
    let vert6 = new Float32Array([maxCorner[0], minCorner[1], maxCorner[2], 1.0]);
    let vert7 = new Float32Array([maxCorner[0], maxCorner[1], minCorner[2], 1.0]);
    let vert8 = new Float32Array([maxCorner[0], maxCorner[1], maxCorner[2], 1.0]);

    let vertLength = this.vertexPositions.length;
    let normLength = this.vertexNormals.length;
    let vertCount = vertLength/4;
    let faceLength = this.faceIndices.length;

    let normVec1: Vec3;
    let normVec2: Vec3;
    let normal: Vec3;
    let normalArr: Float32Array;

    tempVertices.set(this.vertexPositions);
    tempNormals.set(this.vertexNormals);
    tempFaces.set(this.faceIndices);

    // F1, T1
    tempVertices.set(vert2, vertLength);
    vertLength +=4;

    tempVertices.set(vert4, vertLength);
    vertLength +=4;

    tempVertices.set(vert8, vertLength);
    vertLength +=4;

    tempVertices.set(vert6, vertLength);
    vertLength +=4;

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+1;
    tempFaces[faceLength] = vertCount+2;
    faceLength +=3

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+2;
    tempFaces[faceLength] = vertCount+3;
    faceLength +=3;

    vertCount+=4;

    // F1, T2

    // tempVertices.set(vert2, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert8, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert6, vertLength);
    // vertLength +=4;

    // tempFaces[faceLength] = vertCount;
    // tempFaces[faceLength+1] = vertCount+1;
    // tempFaces[faceLength+2] = vertCount+2;
    // vertCount+=3;
    // faceLength +=3;

    // Now, add normals for all 6 vertices.
    // let normArr1 = new Float32Array([vert8[0] - vert6[0], vert8[1] - vert6[1], vert8[2] - vert6[2]]);
    // let normArr2 = new Float32Array([vert2[0] - vert6[0], vert2[1] - vert6[1], vert2[2] - vert6[2]]);
    normVec1 = new Vec3([vert8[0] - vert6[0], vert8[1] - vert6[1], vert8[2] - vert6[2]]);
    normVec2 = new Vec3([vert2[0] - vert6[0], vert2[1] - vert6[1], vert2[2] - vert6[2]]);
    normal = Vec3.cross(normVec1, normVec2);
    // console.log(normVec1);
    // console.log(normVec2);
    // console.log(normal);
    normal.normalize();
    // console.log(normal);

    normalArr = new Float32Array([normal.x, normal.y, normal.z, 0.0]);

    for (let i=0; i<4; i++) {
      tempNormals.set(normalArr, normLength);
      normLength += 4;
    }
    
    // F2, T1
    tempVertices.set(vert5, vertLength);
    vertLength +=4;

    tempVertices.set(vert7, vertLength);
    vertLength +=4;

    tempVertices.set(vert3, vertLength);
    vertLength +=4;

    tempVertices.set(vert1, vertLength);
    vertLength +=4;

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+1;
    tempFaces[faceLength] = vertCount+2;
    faceLength +=3

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+2;
    tempFaces[faceLength] = vertCount+3;
    faceLength +=3;

    vertCount+=4;

    // F2, T2

    // tempVertices.set(vert5, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert3, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert1, vertLength);
    // vertLength +=4;

    // tempFaces[faceLength] = vertCount;
    // tempFaces[faceLength+1] = vertCount+1;
    // tempFaces[faceLength+2] = vertCount+2;
    // vertCount+=3;
    // faceLength +=3;

    // Now, add normals for all 6 vertices.
    // let normArr1 = new Float32Array([vert8[0] - vert6[0], vert8[1] - vert6[1], vert8[2] - vert6[2]]);
    // let normArr2 = new Float32Array([vert2[0] - vert6[0], vert2[1] - vert6[1], vert2[2] - vert6[2]]);
    normVec1 = new Vec3([vert3[0] - vert1[0], vert3[1] - vert1[1], vert3[2] - vert1[2]]);
    normVec2 = new Vec3([vert5[0] - vert1[0], vert5[1] - vert1[1], vert5[2] - vert1[2]]);
    normal = Vec3.cross(normVec1, normVec2);
    normal.normalize();

    normalArr = new Float32Array([normal.x, normal.y, normal.z, 0.0]);

    for (let i=0; i<4; i++) {
      tempNormals.set(normalArr, normLength);
      normLength += 4;
    }

    // F3, T1
    tempVertices.set(vert1, vertLength);
    vertLength +=4;

    tempVertices.set(vert3, vertLength);
    vertLength +=4;

    tempVertices.set(vert4, vertLength);
    vertLength +=4;

    tempVertices.set(vert2, vertLength);
    vertLength +=4;

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+1;
    tempFaces[faceLength] = vertCount+2;
    faceLength +=3

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+2;
    tempFaces[faceLength] = vertCount+3;
    faceLength +=3;

    vertCount+=4;

    // F3, T2

    // tempVertices.set(vert1, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert4, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert2, vertLength);
    // vertLength +=4;

    // tempFaces[faceLength] = vertCount;
    // tempFaces[faceLength+1] = vertCount+1;
    // tempFaces[faceLength+2] = vertCount+2;
    // vertCount+=3;
    // faceLength +=3;

    // Now, add normals for all 6 vertices.
    // let normArr1 = new Float32Array([vert8[0] - vert6[0], vert8[1] - vert6[1], vert8[2] - vert6[2]]);
    // let normArr2 = new Float32Array([vert2[0] - vert6[0], vert2[1] - vert6[1], vert2[2] - vert6[2]]);
    normVec1 = new Vec3([vert4[0] - vert2[0], vert4[1] - vert2[1], vert4[2] - vert2[2]]);
    normVec2 = new Vec3([vert1[0] - vert2[0], vert1[1] - vert2[1], vert1[2] - vert2[2]]);
    normal = Vec3.cross(normVec1, normVec2);
    normal.normalize();

    normalArr = new Float32Array([normal.x, normal.y, normal.z, 0.0]);

    for (let i=0; i<4; i++) {
      tempNormals.set(normalArr, normLength);
      normLength += 4;
    }

    // F4, T1
    tempVertices.set(vert6, vertLength);
    vertLength +=4;

    tempVertices.set(vert8, vertLength);
    vertLength +=4;

    tempVertices.set(vert7, vertLength);
    vertLength +=4;

    tempVertices.set(vert5, vertLength);
    vertLength +=4;

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+1;
    tempFaces[faceLength] = vertCount+2;
    faceLength +=3

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+2;
    tempFaces[faceLength] = vertCount+3;
    faceLength +=3;

    vertCount+=4;

    // F4, T2

    // tempVertices.set(vert6, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert7, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert5, vertLength);
    // vertLength +=4;

    // tempFaces[faceLength] = vertCount;
    // tempFaces[faceLength+1] = vertCount+1;
    // tempFaces[faceLength+2] = vertCount+2;
    // vertCount+=3;
    // faceLength +=3;

    // Now, add normals for all 6 vertices.
    // let normArr1 = new Float32Array([vert8[0] - vert6[0], vert8[1] - vert6[1], vert8[2] - vert6[2]]);
    // let normArr2 = new Float32Array([vert2[0] - vert6[0], vert2[1] - vert6[1], vert2[2] - vert6[2]]);
    normVec1 = new Vec3([vert7[0] - vert5[0], vert7[1] - vert5[1], vert7[2] - vert5[2]]);
    normVec2 = new Vec3([vert6[0] - vert5[0], vert6[1] - vert5[1], vert6[2] - vert5[2]]);
    normal = Vec3.cross(normVec1, normVec2);
    normal.normalize();

    normalArr = new Float32Array([normal.x, normal.y, normal.z, 0.0]);

    for (let i=0; i<4; i++) {
      tempNormals.set(normalArr, normLength);
      normLength += 4;
    }

    // F5, T1
    tempVertices.set(vert1, vertLength);
    vertLength +=4;

    tempVertices.set(vert2, vertLength);
    vertLength +=4;

    tempVertices.set(vert6, vertLength);
    vertLength +=4;

    tempVertices.set(vert5, vertLength);
    vertLength +=4;

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+1;
    tempFaces[faceLength] = vertCount+2;
    faceLength +=3

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+2;
    tempFaces[faceLength] = vertCount+3;
    faceLength +=3;

    vertCount+=4;


    // F5, T2

    // tempVertices.set(vert1, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert6, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert5, vertLength);
    // vertLength +=4;

    // tempFaces[faceLength] = vertCount;
    // tempFaces[faceLength+1] = vertCount+1;
    // tempFaces[faceLength+2] = vertCount+2;
    // vertCount+=3;
    // faceLength +=3;

    // Now, add normals for all 6 vertices.
    // let normArr1 = new Float32Array([vert8[0] - vert6[0], vert8[1] - vert6[1], vert8[2] - vert6[2]]);
    // let normArr2 = new Float32Array([vert2[0] - vert6[0], vert2[1] - vert6[1], vert2[2] - vert6[2]]);
    normVec1 = new Vec3([vert6[0] - vert5[0], vert6[1] - vert5[1], vert6[2] - vert5[2]]);
    normVec2 = new Vec3([vert1[0] - vert5[0], vert1[1] - vert5[1], vert1[2] - vert5[2]]);
    normal = Vec3.cross(normVec1, normVec2);
    normal.normalize();

    normalArr = new Float32Array([normal.x, normal.y, normal.z, 0.0]);

    for (let i=0; i<4; i++) {
      tempNormals.set(normalArr, normLength);
      normLength += 4;
    }

    // F6, T1
    tempVertices.set(vert7, vertLength);
    vertLength +=4;

    tempVertices.set(vert8, vertLength);
    vertLength +=4;

    tempVertices.set(vert4, vertLength);
    vertLength +=4;

    tempVertices.set(vert3, vertLength);
    vertLength +=4;

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+1;
    tempFaces[faceLength] = vertCount+2;
    faceLength +=3

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+2;
    tempFaces[faceLength] = vertCount+3;
    faceLength +=3;

    vertCount+=4;

    // F6, T2

    // tempVertices.set(vert7, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert4, vertLength);
    // vertLength +=4;

    // tempVertices.set(vert3, vertLength);
    // vertLength +=4;

    // tempFaces[faceLength] = vertCount;
    // tempFaces[faceLength+1] = vertCount+1;
    // tempFaces[faceLength+2] = vertCount+2;
    // vertCount+=3;
    // faceLength +=3;

    // Now, add normals for all 6 vertices.
    // let normArr1 = new Float32Array([vert8[0] - vert6[0], vert8[1] - vert6[1], vert8[2] - vert6[2]]);
    // let normArr2 = new Float32Array([vert2[0] - vert6[0], vert2[1] - vert6[1], vert2[2] - vert6[2]]);
    normVec1 = new Vec3([vert4[0] - vert3[0], vert4[1] - vert3[1], vert4[2] - vert3[2]]);
    normVec2 = new Vec3([vert7[0] - vert3[0], vert7[1] - vert3[1], vert7[2] - vert3[2]]);
    normal = Vec3.cross(normVec1, normVec2);
    normal.normalize();

    normalArr = new Float32Array([normal.x, normal.y, normal.z, 0.0]);

    for (let i=0; i<4; i++) {
      tempNormals.set(normalArr, normLength);
      normLength += 4;
    }

    this.vertexPositions = tempVertices;
    this.vertexNormals = tempNormals;
    this.faceIndices = tempFaces;

    // console.log(this.faceIndices.length);

  }
  
}
