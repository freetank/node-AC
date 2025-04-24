import { ClassicPreset } from "rete";
import { FloatingNumberSocket, GuidSocket } from "../sockets";

export class GetSlabNode extends ClassicPreset.Node {
  constructor(otherSocket: ClassicPreset.Socket) {
	super("Get slab");

	this.addInput("elemGuid", new ClassicPreset.Input(new GuidSocket (), "GUID"));
	this.addOutput("level", new ClassicPreset.Output(new FloatingNumberSocket (), "Level"));
	this.addOutput("poly", new ClassicPreset.Output(otherSocket));
	this.addOutput("thickness", new ClassicPreset.Output(new FloatingNumberSocket (), "Thickness"));

	return this;
  }
}