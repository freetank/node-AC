import { ClassicPreset } from "rete";
import { DropDownControl } from "../dropdownControl";
import { GuidSocket } from "../sockets";
import { StartNode } from "./startNode";
import { v4 as uuidv4 } from 'uuid';
import { ScriptBuilder } from "../ACObjectTypes";

declare var scriptBuilder: ScriptBuilder;

export class CatchNewElementNode extends StartNode {
  private dropdownControl: DropDownControl;
  private guid: string;

  constructor(itemsJSON: string) {
    super("Event: Catch new element");

    this.guid = uuidv4();

    this.dropdownControl = new DropDownControl(itemsJSON);
    this.addControl("dropdown", this.dropdownControl);
    this.addOutput("elemGuid", new ClassicPreset.Output(new GuidSocket, "GUID"));

    return this;
  }

  data(): {elemGuid: string} {
    console.log("CatchNewElementNode data: " + this.guid);
    return {
      elemGuid: this.guid
    };
  }

  async execute(_: never, forward: (output: string) => void) {
    console.log("CatchNewElementNode execute: " + this.guid);
    scriptBuilder.catchNewElement(this.dropdownControl.getSelectedItem(), this.guid);
    forward("elemGuid");
  }
}