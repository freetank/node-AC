import { GetSchemes, ClassicPreset } from "rete";
import { ReactArea2D } from "rete-react-plugin";
import { DropDownControl } from "./dropdownControl";

type NodeData = { [key in string]: ClassicPreset.Socket; }
type NodeControls = {
  [key in string]:
    | DropDownControl
    | ClassicPreset.Control
    | ClassicPreset.InputControl<"number">
    | ClassicPreset.InputControl<"text">
    | undefined;
}

export class Node extends ClassicPreset.Node<NodeData, NodeData, NodeControls> {}
type Connection = ClassicPreset.Connection<Node, Node>;
export type Schemes = GetSchemes<Node, Connection>;
export type AreaExtra = ReactArea2D<Schemes>;