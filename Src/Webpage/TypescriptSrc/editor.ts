import { createRoot } from "react-dom/client";
import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets } from "rete-react-plugin";
import { Schemes, AreaExtra } from "./nodes/nodeTypes";
import { DockPlugin, DockPresets } from "rete-dock-plugin";
import { DropDownControl } from "./dropdownControl";
import { CustomDropDown } from "./dropdownControlUI";
import { CatchNewElementInfo, ACConnection } from "./ACObjectTypes";
import { getConnectionSockets } from "./sockets"; // Adjust the path as needed
import { CatchNewElementNode } from "./nodes/catchNewElementNode";
import { GetSlabNode } from "./nodes/getSlabNode";

declare var DG: any;
declare var catchNewElementInfo: CatchNewElementInfo;
declare var acConnection: ACConnection;

async function createEditor(container: HTMLElement) {
  createRoot (container);

  const area = new AreaPlugin<Schemes, AreaExtra>(container);

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  render.addPreset(
    Presets.classic.setup({
      customize: {
        control: (data) => {
          if (data.payload instanceof DropDownControl) {
            return CustomDropDown;
          }
          if (data.payload instanceof ClassicPreset.InputControl) {
            return Presets.classic.Control as any;
          }
          return null;
        }
      }
    })
  );

  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  connection.addPreset(ConnectionPresets.classic.setup());

  const dock = new DockPlugin<Schemes>();
  dock.addPreset(DockPresets.classic.setup({ area, size: 100, scale: 0.6 }));

  const editor = new NodeEditor<Schemes>();
  editor.addPipe((context) => {
    if (context.type === "connectioncreate") {
      const { data } = context;
      const { source, target } = getConnectionSockets(editor, data);

      if (!source.isCompatibleWith(target)) {
        console.log("Sockets are not compatible", "error");
        return;
      }
    }
    return context;
  });

  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(dock);

  if (typeof catchNewElementInfo === "undefined") {
    await DG.LoadObject("catchNewElementInfo");
  }
  const elementTypes: string = await catchNewElementInfo.getElementTypes();
  dock.add (() => new CatchNewElementNode(elementTypes));
  const socket = new ClassicPreset.Socket("socket");
  dock.add (() => new GetSlabNode(socket));

  AreaExtensions.simpleNodesOrder(area);

  if (typeof acConnection === "undefined") {
    await DG.LoadObject("acConnection");
  }
  acConnection.editorCreated();

  setTimeout(() => {
    // wait until nodes rendered because they dont have predefined width and height
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 10);
  return {
    destroy: () => area.destroy(),
  };
}

window.addEventListener("load", (event) => {
  const editorContainer = document.getElementById("container")!;
  createEditor(editorContainer);
});