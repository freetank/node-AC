export declare interface CatchNewElementInfo {
  getElementTypes(): any; 
  registerNewElementCallback (elementID: number): any;
}

export declare interface ACConnection {
  editorCreated (): void;
}

export declare interface ScriptBuilder {
  scriptCreationDone (): void;
}