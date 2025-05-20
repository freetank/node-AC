import { ClassicPreset } from "rete";
import { FloatingNumberSocket, GuidSocket, PositionSocket, PolygonSocket } from "../sockets";
import { DataflowEngine } from "rete-engine";
import { Schemes } from "./nodeTypes";
import { ScriptBuilder } from "../ACObjectTypes";
import { Coordinate, Polygon } from "../commonTypes";

declare var scriptBuilder: ScriptBuilder

export class GetSlabNode extends ClassicPreset.Node {
  constructor(private dataflow: DataflowEngine<Schemes>) {
    super("Get slab");

    this.addInput("elemGuid", new ClassicPreset.Input(new GuidSocket (), "GUID"));

    this.addOutput("level", new ClassicPreset.Output(new FloatingNumberSocket (), "Level"));
    this.addOutput("thickness", new ClassicPreset.Output(new FloatingNumberSocket (), "Thickness"));
    this.addOutput("position", new ClassicPreset.Output(new PositionSocket (), "Position"));
    this.addOutput("polygon", new ClassicPreset.Output(new PolygonSocket (), "Polygon"));

    return this;
  }

  data(inputs: {elemGuid: string}): {level: number, thickness: number, position: Coordinate, polygon: Polygon} {
    console.log("GUID arrived!");
    console.log(inputs.elemGuid);
    return {
      level: 3,
      thickness: 11.4,
      position: [0, 0],
      polygon: [[0, 0], [1, 1], [2, 2]]
    };
  }

  async execute(_: never, forward: (output: string) => void) {
    console.log("GetSlabNode execute");

    const inputs = await this.dataflow.fetchInputs(this.id);
    console.log("Inputs: ", inputs);

    scriptBuilder.getElement(inputs.elemGuid[0]);
    forward("level");
    forward("thickness");
    forward("position");
    forward("polygon");

    scriptBuilder.scriptCreationDone(); // TODO PaM: remove this
  }
}