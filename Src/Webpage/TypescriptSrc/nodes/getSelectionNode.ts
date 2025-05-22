import { ClassicPreset } from "rete";
import { GuidSocket } from "../sockets";
import { StartNode } from "./startNode";
import { v4 as uuidv4 } from 'uuid';
import { ScriptBuilder } from "../ACObjectTypes";

declare var scriptBuilder: ScriptBuilder;

export class GetSelectionNode extends StartNode {
  private guid: string;

  constructor() {
    super("Get Selection");

    this.guid = uuidv4();

    this.addOutput("elemGuid", new ClassicPreset.Output(new GuidSocket, "GUID"));

    return this;
  }

  data(): {elemGuid: string} {
    console.log("GetSelectionNode data: " + this.guid);
    return {
      elemGuid: this.guid
    };
  }

  async execute(_: never, forward: (output: string) => void) {
    let str: string = await scriptBuilder.getSelection();
    console.log("GetSelectionNode execute: " + str);
    this.guid = str;
    forward("elemGuid");
  }
}