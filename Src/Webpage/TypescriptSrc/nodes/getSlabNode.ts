import { ClassicPreset } from "rete";
import { FloatingNumberSocket, GuidSocket, PositionSocket, PolygonSocket } from "../sockets";
import { DataflowEngine } from "rete-engine";
import { Schemes } from "./nodeTypes";
import { ScriptBuilder } from "../ACObjectTypes";
import { Coordinate, Polygon } from "../commonTypes";

declare var scriptBuilder: ScriptBuilder

export class GetSlabNode extends ClassicPreset.Node {
  private level: number;
  private thickness: number;
  private polygon: Polygon;

  constructor(private dataflow: DataflowEngine<Schemes>) {
    super("Get slab");

    this.level = 0;
    this.thickness = 0;
    this.polygon = [];

    this.addInput("elemGuid", new ClassicPreset.Input(new GuidSocket (), "GUID"));

    this.addOutput("level", new ClassicPreset.Output(new FloatingNumberSocket (), "Level"));
    this.addOutput("thickness", new ClassicPreset.Output(new FloatingNumberSocket (), "Thickness"));
    this.addOutput("polygon", new ClassicPreset.Output(new PolygonSocket (), "Polygon"));

    return this;
  }

  data(_: {elemGuid: string}): {level: number, thickness: number, polygon: Polygon} {
    return {
      level: this.level,
      thickness: this.thickness,
      polygon: this.polygon
    };
  }

  async execute(_: never, forward: (output: string) => void) {
    console.log("GetSlabNode execute");

    const inputs = await this.dataflow.fetchInputs(this.id);
    console.log("Inputs: ", inputs);

    let slabParams = await scriptBuilder.getSlab(inputs.elemGuid[0]);
    console.log("Slab params: ", slabParams);

    this.level = slabParams.level;
    this.thickness = slabParams.thickness;
    this.polygon = slabParams.polygon;

    forward("level");
    forward("thickness");
    forward("polygon");
  }
}