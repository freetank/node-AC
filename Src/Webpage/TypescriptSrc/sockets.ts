import { ClassicPreset, NodeEditor } from "rete";
import { Schemes } from "./nodes/nodeTypes";

export class GuidSocket extends ClassicPreset.Socket {
  constructor() {
    super("GUID");
  }

  isCompatibleWith(socket: ClassicPreset.Socket) {
    return socket instanceof GuidSocket;
  }
}

export class FloatingNumberSocket extends ClassicPreset.Socket {
  constructor() {
    super("double");
  }

  isCompatibleWith(socket: ClassicPreset.Socket) {
    return socket instanceof FloatingNumberSocket;
  }
}

// TODO PaM Find an appropriate place for this class
type Sockets = GuidSocket | FloatingNumberSocket;
type Input = ClassicPreset.Input<Sockets>;
type Output = ClassicPreset.Output<Sockets>;

export function getConnectionSockets(editor: NodeEditor<Schemes>, connection: Schemes["Connection"]) {
  const source = editor.getNode(connection.source);
  const target = editor.getNode(connection.target);

  const output = source && (source.outputs as Record<string, Output>)[connection.sourceOutput];
  const input = target && (target.inputs as Record<string, Input>)[connection.targetInput];

  return {
    source: output?.socket,
    target: input?.socket
  };
}