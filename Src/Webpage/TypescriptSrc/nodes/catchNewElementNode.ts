import { ClassicPreset } from "rete";
import { DropDownControl } from "../dropdownControl";
import { GuidSocket } from "../sockets";
import { StartNode } from "./startNode";
import { DataflowEngine } from "rete-engine";
import { Schemes } from "./nodeTypes";

export class CatchNewElementNode extends StartNode {
  private dropdownControl: DropDownControl;

  constructor(itemsJSON: string, private dataflow: DataflowEngine<Schemes>) {
    super("Event: Catch new element");

    this.dropdownControl = new DropDownControl(itemsJSON);
    this.addControl("dropdown", this.dropdownControl);
    this.addOutput("elemGuid", new ClassicPreset.Output(new GuidSocket, "GUID"));

    return this;
  }

  data(): {elemGuid: string} {
    console.log("GUID send!");
    return {
      elemGuid: "10000000-0000-0000-0000-000000000000"
    };
  }

  async execute(_: never, forward: (output: string) => void) {
    console.log("CatchNewElementNode execute");
    await this.dataflow.fetch(this.id);
    forward("elemGuid");
  }
}