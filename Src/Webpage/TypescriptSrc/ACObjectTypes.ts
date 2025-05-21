import { Polygon } from './commonTypes';

export declare interface CatchNewElementInfo {
  getElementTypes(): any;
}

export declare interface ACConnection {
  editorCreated (): void;
}

export declare interface ScriptBuilder {
  catchNewElement (elementID: number, guid: string): void;
  getElements (elementID: string): any;
  getElement (guid: string): void;
  generateLayout (description: string, slabPoly: Polygon): void;
  scriptCreationDone (): void;
}