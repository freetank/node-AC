import { ClassicPreset } from "rete";
import { PolygonSocket, PolygonListSocket, StringListSocket } from "../sockets";
import { DataflowEngine } from "rete-engine";
import { Schemes } from "./nodeTypes";
import { ScriptBuilder } from "../ACObjectTypes";
import { Polygon } from "../commonTypes";

declare var scriptBuilder: ScriptBuilder

export class LayoutGenerator extends ClassicPreset.Node {
  private zonePrefixControl: ClassicPreset.InputControl<'text'>;
  private userPromptControl: ClassicPreset.InputControl<'text'>;

  private userPromptInitial: string = "Extra input";

  private zoneNames: string[] = [];
  private zonePolygons: Polygon[] = [];


  constructor(private dataflow: DataflowEngine<Schemes>) {
    super("Layout generator");

    this.zonePrefixControl = new ClassicPreset.InputControl('text', { readonly: false, initial: 'Zone ' });
    this.userPromptControl = new ClassicPreset.InputControl('text', { readonly: false, initial: this.userPromptInitial });
    this.addInput("slabPoly", new ClassicPreset.Input(new PolygonSocket (), "Polygon"));

    this.addOutput("zonePolygons", new ClassicPreset.Output(new PolygonListSocket (), "Zone Polygons"));
    this.addOutput("zoneNames", new ClassicPreset.Output(new StringListSocket (), "Zone names"));
    
    this.addControl("namePrefix", this.zonePrefixControl);
    this.addControl("userPrompt", this.userPromptControl);

    return this;
  }

  data(_: {slabPoly: Polygon}): {zoneNames: string[], zonePolygons: Polygon[]} {
    return {
      zoneNames: this.zoneNames,
      zonePolygons: this.zonePolygons
    };
  }

  async execute(_: string, forward: (output: string) => void) {
    console.log("LayoutGenerator execute");
    
    const inputs = await this.dataflow.fetchInputs(this.id);
    
    console.log("Inputs: ", inputs);
    if (inputs.slabPoly[0] === undefined) {
      console.error("No slab polygon provided");
      return;
    }

    const aiPrompt = "name prefix: " + (this.zonePrefixControl.value ? this.zonePrefixControl.value : "") +
                    ", polygon: " + JSON.stringify(inputs.slabPoly[0]) +
                    ", extra input: " + (this.userPromptControl.value && this.userPromptControl.value !== this.userPromptInitial ? this.userPromptControl.value : "");

    console.log("AI prompt: ", aiPrompt);
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer <API key>"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {role: "system", content: "You are a helpful assistant that only returns JSON arrays of polygons which represents zones of a house. You will be given a slab polygon and a name prefix. Your job is to design room layout of a house or a flat. Return the result as a list of names and polygons like {\"$schema\":\"http://json-schema.org/draft-07/schema#\",\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"polygon\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"x\":{\"type\":\"number\"},\"y\":{\"type\":\"number\"}},\"required\":[\"x\",\"y\"]},\"minItems\":1}},\"required\":[\"name\",\"polygon\"]}}. No extra words. You have to cover the whole area with the result polygons and there can't be overlapping polygons. The polygons should be in the same coordinate system as the slab polygon. Do not put the result in code blocks. Give the result compatible with the JSON.parse in JavaScript. As a result, I want a single list."},
          {role: "user", content: aiPrompt}
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);

        let resultZones = JSON.parse(data.choices[0].message.content);
        
        this.zoneNames = [];
        this.zonePolygons = [];
        for (const zone of resultZones) {
            this.zoneNames.push(zone.name);
            this.zonePolygons.push(zone.polygon);
        }

        console.log("Zone names: ", this.zoneNames);
        console.log("Zone polygons: ", this.zonePolygons);
        
        forward("zoneNames");

        // TODO: Check if more input comes from the same node
        // forward("zonePositions");
        // forward("zonePolygons");
        
        scriptBuilder.scriptCreationDone(); // TODO PaM: remove this
    })
    .catch(error => {
        console.error("Error:", error);
    });

    // fetch("http://localhost:9500/generate-layout", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         // your data here, for example:
    //         slabPoly: inputs.slabPoly[0],
    //         namePrefix: this.zonePrefixControl.value ? this.zonePrefixControl.value : "",
    //         userPrompt: this.userPromptControl.value && this.userPromptControl.value !== this.userPromptInitial ? this.userPromptControl.value : ""
    //     })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log("Success:", data);
    //     forward("zoneNames");

    //     // TODO: Check if more input comes from the same node
    //     // forward("zonePositions");
    //     // forward("zonePolygons");

    //     scriptBuilder.scriptCreationDone(); // TODO PaM: remove this
    // })
    // .catch(error => {
    //     console.error("Error:", error);
    // });
  }
}