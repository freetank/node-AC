import { ClassicPreset } from "rete";
import { PolygonSocket, PositionSocket, StringSocket, PolygonListSocket, PositionListSocket, StringListSocket } from "../sockets";
import { DataflowEngine } from "rete-engine";
import { Schemes } from "./nodeTypes";
import { ScriptBuilder } from "../ACObjectTypes";
import { Coordinate, Polygon } from "../commonTypes";

declare var scriptBuilder: ScriptBuilder

export class LayoutGenerator extends ClassicPreset.Node {
  private zonePrefixControl: ClassicPreset.InputControl<'text'>;

  constructor(private dataflow: DataflowEngine<Schemes>) {
    super("Layout generator");

    this.zonePrefixControl = new ClassicPreset.InputControl('text', { readonly: false, initial: 'Zone ' });
    this.addInput("slabPoly", new ClassicPreset.Input(new PolygonSocket (), "Slab Polygon"));

    this.addOutput("zonePositions", new ClassicPreset.Output(new PolygonListSocket (), "Zone Position"));
    this.addOutput("zonePolygons", new ClassicPreset.Output(new PolygonListSocket (), "Zone Polygons"));
    this.addOutput("zoneNames", new ClassicPreset.Output(new StringListSocket (), "Zone names"));
    
    this.addControl("namePrefix", this.zonePrefixControl);

    return this;
  }

  data(inputs: {slabPoly: Polygon, namePrefix: string}): {zonePositions: Coordinate[], zonePolygons: Polygon[], zoneNames: string[]} {
    console.log("Slab Polygon arrived!");
    console.log(inputs.slabPoly);
    console.log("Name Prefix was always here!");
    console.log(this.zonePrefixControl.value);
    return {
      zonePositions: [[0, 0], [1, 1], [2, 2]],
      zonePolygons: [[[0, 0], [1, 1], [2, 2]], [[3, 3], [4, 4], [5, 5]], [[3, 3], [4, 4], [5, 5]]],
      zoneNames: ["Zone 1", "Zone 2", "Zone 3"]
    };
  }

  async execute(_: never, forward: (output: string) => void) {
    console.log("LayoutGenerator execute");
    const inputs = await this.dataflow.fetchInputs(this.id);
    console.log("Inputs: ", inputs);
    console.log("Zone Prefix: ", this.zonePrefixControl.value);
    scriptBuilder.scriptCreationDone();
    forward("zonePositions");
    forward("zonePolygons");
    forward("zoneNames");
  }
}