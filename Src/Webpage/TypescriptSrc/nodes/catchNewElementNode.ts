import { ClassicPreset } from "rete";
import { DropDownControl } from "../dropdownControl";
import { GuidSocket } from "../sockets";
import { StartNode } from "./startNode";

export class CatchNewElementNode extends StartNode {
  constructor(itemsJSON: string) {
    super("Event: Catch new element");

    this.addControl("dropdown", new DropDownControl(itemsJSON));
    this.addOutput("elemGuid", new ClassicPreset.Output(new GuidSocket, "GUID"));

    return this;
  }

  data(): {elemGuid: string} {
    console.log("GUID send!");
    return {
      elemGuid: "10000000-0000-0000-0000-000000000000"
    };
  }

  execute(_: never, forward: (output: string) => void) {
    console.log("CatchNewElementNode execute");
    forward("elemGuid");
  }
}