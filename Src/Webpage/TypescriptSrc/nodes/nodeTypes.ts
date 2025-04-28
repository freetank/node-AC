import { GetSchemes, ClassicPreset } from "rete";
import { ReactArea2D } from "rete-react-plugin";
import { GetSlabNode } from "./getSlabNode";
import { CatchNewElementNode } from "./catchNewElementNode";

export type Node =
  | CatchNewElementNode
  | GetSlabNode;

export class ConnectionBase<
  A extends Node,
  B extends Node
> extends ClassicPreset.Connection<A, B> {}
type Connection = 
  | ConnectionBase<CatchNewElementNode, GetSlabNode>;

export type Schemes = GetSchemes<Node, Connection>;
export type AreaExtra = ReactArea2D<Schemes>;