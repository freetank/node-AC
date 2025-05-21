import { ClassicPreset } from "rete";

export abstract class StartNode extends ClassicPreset.Node {
  constructor(label: string) {
    super(label);
  }
}