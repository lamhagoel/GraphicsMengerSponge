import { Mat3, Mat4, Vec3, Vec4 } from "../lib/TSM.js";
// ------------------------------ better known as Bob Esponja ------------------------------------------------------------------------------------------
// ------------------------------ better known as Bob Esponja ------------------------------------------------------------------------------------------
// ------------------------------ better known as Bob Esponja ------------------------------------------------------------------------------------------
// ------------------------------ better known as Bob Esponja ------------------------------------------------------------------------------------------
// ------------------------------ better known as Bob Esponja ------------------------------------------------------------------------------------------
// ------------------------------ better known as Bob Esponja ------------------------------------------------------------------------------------------
// ------------------------------ better known as Bob Esponja ------------------------------------------------------------------------------------------
// ------------------------------ better known as Bob Esponja ------------------------------------------------------------------------------------------
// ------------------------------ better known as Bob Esponja ------------------------------------------------------------------------------------------
/* A potential interface that students should implement */
interface IFloor {
  setFloor(): void;
  isDirty(): boolean;
  setClean(): void;
  normalsFlat(): Float32Array;
  indicesFlat(): Uint32Array;
  positionsFlat(): Float32Array;
}

/**
 * Represents a Menger Sponge
 */
export class Floor implements IFloor {

  private dirty: boolean; // TODO: See when to set/unset this
  private vertexPositions: Float32Array;
  private faceIndices: Uint32Array;
  private vertexNormals: Float32Array;
  private minFloor = -10.0;
  private maxFloor = 10.0;
  private centerY = -2.0;
  // private level: number;
  // private printedBefore = false;
  
  constructor() {
    this.setFloor();
    
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
  
  public setFloor()
  {
    this.vertexPositions = new Float32Array(0);
    this.faceIndices = new Uint32Array(0);
    this.vertexNormals = new Float32Array(0);
    this.addFloor();
    this.dirty = true;
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

  // private addCube(minCorner: Float32Array, maxCorner: Float32Array): void {
  private addFloor(): void {
    // We're dealing w homogeneous coordinates, so 4 coords per vertex.

    // TODO: fix length
    let tempVertices: Float32Array = new Float32Array(this.vertexPositions.length + 6*4);
    let tempNormals: Float32Array = new Float32Array(this.vertexNormals.length + 6*4);
    let tempFaces: Uint32Array = new Uint32Array(this.faceIndices.length + 6);

    let vert0 = new Float32Array([this.minFloor, this.centerY, this.minFloor, 1.0]);
    let vert1 = new Float32Array([this.minFloor, this.centerY, this.maxFloor, 1.0]);
    let vert2 = new Float32Array([this.maxFloor, this.centerY, this.minFloor, 1.0]);
    let vert3 = new Float32Array([this.maxFloor, this.centerY, this.maxFloor, 1.0]);
    let vert4 = new Float32Array([this.maxFloor, this.centerY, this.minFloor, 1.0]);
    let vert5 = new Float32Array([this.minFloor, this.centerY, this.maxFloor, 1.0]);

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

    // first triangle
    tempVertices.set(vert0, vertLength);
    vertLength +=4;

    tempVertices.set(vert1, vertLength);
    vertLength +=4;

    tempVertices.set(vert2, vertLength);
    vertLength +=4;

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+1;
    tempFaces[faceLength] = vertCount+2;
    faceLength +=3;

    vertCount+=3;
    
    normVec1 = new Vec3([vert1[0] - vert0[0], vert1[1] - vert0[1], vert1[2] - vert0[2]]);
    normVec2 = new Vec3([vert2[0] - vert0[0], vert2[1] - vert0[1], vert2[2] - vert0[2]]);
    normal = Vec3.cross(normVec1, normVec2);

    normal.normalize();

    normalArr = new Float32Array([normal.x, normal.y, normal.z, 0.0]);

    for (let i=0; i<3; i++) {
      tempNormals.set(normalArr, normLength);
      normLength += 4;
    }
    
    // second
    tempVertices.set(vert3, vertLength);
    vertLength +=4;

    tempVertices.set(vert4, vertLength);
    vertLength +=4;

    tempVertices.set(vert5, vertLength);
    vertLength +=4;

    tempFaces[faceLength+2] = vertCount;
    tempFaces[faceLength+1] = vertCount+1;
    tempFaces[faceLength] = vertCount+2;
    faceLength +=3;

    vertCount+=3;
    
    normVec1 = new Vec3([vert4[0] - vert3[0], vert4[1] - vert3[1], vert4[2] - vert3[2]]);
    normVec2 = new Vec3([vert5[0] - vert3[0], vert5[1] - vert3[1], vert5[2] - vert3[2]]);
    normal = Vec3.cross(normVec1, normVec2);

    normal.normalize();

    normalArr = new Float32Array([normal.x, normal.y, normal.z, 0.0]);

    for (let i=0; i<3; i++) {
      tempNormals.set(normalArr, normLength);
      normLength += 4;
    }


    this.vertexPositions = tempVertices;
    this.vertexNormals = tempNormals;
    this.faceIndices = tempFaces;

    // console.log(this.faceIndices.length);

  }
  
}
