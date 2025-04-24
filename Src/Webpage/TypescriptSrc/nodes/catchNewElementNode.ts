import { ClassicPreset } from "rete";
import { DropDownControl } from "../dropdownControl";
import { GuidSocket } from "../sockets";

export class CatchNewElementNode extends ClassicPreset.Node {
  constructor(itemsJSON: string) {
	super("Event: Catch new element");

	this.addControl("dropdown", new DropDownControl(itemsJSON));
	this.addOutput("elemGuid", new ClassicPreset.Output(new GuidSocket, "GUID"));

	return this;
  }
}