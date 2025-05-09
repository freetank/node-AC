import { ClassicPreset } from "rete";
import { FloatingNumberSocket, GuidSocket } from "../sockets";
import { DataflowEngine } from "rete-engine";
import { Schemes } from "./nodeTypes";

export class GetSlabNode extends ClassicPreset.Node {
  constructor(private dataflow: DataflowEngine<Schemes>) {
	super("Get slab");

	this.addInput("elemGuid", new ClassicPreset.Input(new GuidSocket (), "GUID"));

	this.addOutput("level", new ClassicPreset.Output(new FloatingNumberSocket (), "Level"));
	this.addOutput("thickness", new ClassicPreset.Output(new FloatingNumberSocket (), "Thickness"));

	return this;
  }

  data(inputs: {elemGuid: string}): {level: number, thickness: number} {
	console.log("GUID arrived!");
	console.log(inputs.elemGuid);
	return {
		level: 3,
		thickness: 11.4
	};
  }

  async execute(_: never, forward: (output: string) => void) {
	console.log("GetSlabNode execute");
	const inputs = await this.dataflow.fetchInputs(this.id);
	console.log("Inputs: ", inputs);
	forward("level");
	forward("thickness");
  }
}