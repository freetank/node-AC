export declare interface CatchNewElementInfo {
  getElementTypes(): any; 
  registerNewElementCallback (elementID: number): any;
}

export declare interface ACConnection {
  editorCreated (): void;
}