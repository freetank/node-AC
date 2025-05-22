import { Polygon } from './commonTypes';

export declare interface CatchNewElementInfo {
  getElementTypes(): any;
}

export declare interface ACConnection {
  editorCreated (): void;
}

export declare interface ScriptBuilder {
  getSelection (): Promise<string>;
  getElements (elementID: string): any;
  getSlab (guid: string): any;
  generateLayout (description: string, slabPoly: Polygon): void;
  scriptCreationDone (): void;
}