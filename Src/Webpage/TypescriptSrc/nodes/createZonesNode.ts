import { ClassicPreset } from "rete";
import { PolygonSocket, StringSocket } from "../sockets";
import { DataflowEngine } from "rete-engine";
import { Schemes } from "./nodeTypes";
import { ScriptBuilder } from "../ACObjectTypes";
import { Polygon } from "../commonTypes";

declare var scriptBuilder: ScriptBuilder

export class CreateZonesNode extends ClassicPreset.Node {
  constructor(private dataflow: DataflowEngine<Schemes>) {
    super("Create zones");

    this.addInput("polys", new ClassicPreset.Input(new PolygonSocket (), "polys"));
    this.addInput("names", new ClassicPreset.Input(new StringSocket (), "names"));

    return this;
  }

  data(_: {polys: Polygon, names: string}): any {
  }

  async execute(_: never, __: never) {
    console.log("CreateZones execute");

    const inputs = await this.dataflow.fetchInputs(this.id);
    console.log("Inputs: ", inputs);

    for (let i = 0; i<inputs.polys[0].length; i++) {
      let polygon = inputs.polys[0][i];
      await scriptBuilder.createZone(polygon, inputs.names[0][i]);
    }
  }
}