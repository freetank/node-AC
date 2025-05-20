export declare interface CatchNewElementInfo {
  getElementTypes(): any;
}

export declare interface ACConnection {
  editorCreated (): void;
}

export declare interface ScriptBuilder {
  catchNewElement (elementID: number, guid: string): void;
  getElement (guid: string): void;
  scriptCreationDone (): void;
}