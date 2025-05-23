import { GetSchemes, ClassicPreset } from "rete";
import { ReactArea2D } from "rete-react-plugin";
import { GetSlabNode } from "./getSlabNode";
import { GetSelectionNode } from "./getSelectionNode";
import { LayoutGenerator } from "./layoutGenerator";
import { CreateZonesNode } from "./createZonesNode";

export type Node =
  | GetSelectionNode
  | GetSlabNode
  | LayoutGenerator
  | CreateZonesNode;

export class ConnectionBase<
  A extends Node,
  B extends Node
> extends ClassicPreset.Connection<A, B> {}
type Connection = 
  | ConnectionBase<GetSelectionNode, GetSlabNode>
  | ConnectionBase<GetSlabNode, LayoutGenerator>
  | ConnectionBase<LayoutGenerator, CreateZonesNode>;

export type Schemes = GetSchemes<Node, Connection>;
export type AreaExtra = ReactArea2D<Schemes>;