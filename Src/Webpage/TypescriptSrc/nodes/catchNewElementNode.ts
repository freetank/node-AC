import { ClassicPreset } from "rete";
import { DropDownControl } from "../dropdownControl";

export class CatchNewElementNode extends ClassicPreset.Node {
  constructor(socket: ClassicPreset.Socket, itemsJSON: string) {
	super("Event: Catch new element");

	this.addControl("dropdown", new DropDownControl(itemsJSON));
	this.addOutput("dropdown", new ClassicPreset.Output(socket));

	return this;
  }
}