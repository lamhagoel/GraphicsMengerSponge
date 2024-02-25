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

  private dirty: boolean;
  private vertexPositions: Float32Array;
  private faceIndices: Uint32Array;
  private vertexNormals: Float32Array;
  private minFloor = Number.MIN_SAFE_INTEGER;
  private maxFloor = Number.MAX_SAFE_INTEGER;
  private centerY = -2.0;

  constructor() {
    this.setFloor();
  }

  /**
   * Returns true if the floor has changed.
   */
  public isDirty(): boolean {
       return this.dirty;
  }

  public setClean(): void {
    this.dirty = false;
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

  private addFloor(): void {
    // We're dealing w homogeneous coordinates, so 4 coords per vertex.

    // console.log("Adding floor", this.minFloor, this.maxFloor);

    // TODO: fix length
    let tempVertices: Float32Array = new Float32Array(5*4);
    let tempNormals: Float32Array = new Float32Array(5*4);
    let tempFaces: Uint32Array = new Uint32Array(4*3);

    let floorCenter = (this.minFloor + this.maxFloor)/2.0;
    let vert0 = new Float32Array([floorCenter, this.centerY, floorCenter, 1.0]);
    let vert1 = new Float32Array([this.maxFloor, this.centerY, this.minFloor, 1.0]);
    let vert2 = new Float32Array([this.maxFloor, this.centerY, this.maxFloor, 1.0]);
    let vert3 = new Float32Array([this.minFloor, this.centerY, this.maxFloor, 1.0]);
    let vert4 = new Float32Array([this.minFloor, this.centerY, this.minFloor, 1.0]);
    // let vert5 = new Float32Array([this.minFloor, this.centerY, this.maxFloor, 1.0]);

    let vertLength = 0;
    let normLength = 0;
    let faceLength = 0;
    
    tempVertices.set(vert0, vertLength);
    vertLength+=4;

    tempVertices.set(vert1, vertLength);
    vertLength+=4;

    tempVertices.set(vert2, vertLength);
    vertLength+=4;

    tempVertices.set(vert3, vertLength);
    vertLength+=4;
    
    tempVertices.set(vert4, vertLength);
    vertLength+=4;

    tempFaces[faceLength] = 0;
    tempFaces[faceLength+1] = 2;
    tempFaces[faceLength+2] = 1;
    faceLength +=3;

    tempFaces[faceLength] = 0;
    tempFaces[faceLength+1] = 3;
    tempFaces[faceLength+2] = 2;
    faceLength +=3;

    tempFaces[faceLength] = 0;
    tempFaces[faceLength+1] = 4;
    tempFaces[faceLength+2] = 3;
    faceLength +=3;

    tempFaces[faceLength] = 0;
    tempFaces[faceLength+1] = 1;
    tempFaces[faceLength+2] = 4;
    faceLength +=3;

   let normalArr = new Float32Array([0.0, 1.0, 0.0, 0.0]);

    for (let i=0; i<5; i++) {
      tempNormals.set(normalArr, normLength);
      normLength += 4;
    }

    this.vertexPositions = tempVertices;
    this.vertexNormals = tempNormals;
    this.faceIndices = tempFaces;
  }
  
}
