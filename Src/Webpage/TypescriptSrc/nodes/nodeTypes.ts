import { GetSchemes, ClassicPreset } from "rete";
import { ReactArea2D } from "rete-react-plugin";
import { GetSlabNode } from "./getSlabNode";
import { CatchNewElementNode } from "./catchNewElementNode";
import { LayoutGenerator } from "./layoutGenerator";

export type Node =
  | CatchNewElementNode
  | GetSlabNode
  | LayoutGenerator;

export class ConnectionBase<
  A extends Node,
  B extends Node
> extends ClassicPreset.Connection<A, B> {}
type Connection = 
  | ConnectionBase<CatchNewElementNode, GetSlabNode>
  | ConnectionBase<GetSlabNode, LayoutGenerator>;

export type Schemes = GetSchemes<Node, Connection>;
export type AreaExtra = ReactArea2D<Schemes>;