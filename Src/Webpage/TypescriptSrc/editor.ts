import { createRoot } from "react-dom/client";
import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets } from "rete-react-plugin";
import { Schemes, AreaExtra } from "./nodeTypes";
import { DockPlugin, DockPresets } from "rete-dock-plugin";
import { DropDownControl } from "./dropdownControl";
import { CustomDropDown } from "./dropdownControlUI";
import { CatchNewElementInfo, ACConnection } from "./ACObjectTypes";
import { addSideMenu } from "./sideMenu";

class CatchNewElementNode extends ClassicPreset.Node {
  constructor(socket: ClassicPreset.Socket, itemsJSON: string) {
    super("Event: Catch new element");

    this.addControl("dropdown", new DropDownControl(itemsJSON));
    this.addOutput("dropdown", new ClassicPreset.Output(socket));

    return this;
  }
}

declare var DG: any;
declare var catchNewElementInfo: CatchNewElementInfo;
declare var acConnection: ACConnection;

async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  createRoot (container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const dock = new DockPlugin<Schemes>();

  dock.addPreset(DockPresets.classic.setup({ area, size: 100, scale: 0.6 }));

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

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

  connection.addPreset(ConnectionPresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(dock);

  AreaExtensions.simpleNodesOrder(area);

  if (typeof acConnection === "undefined") {
    await DG.LoadObject("acConnection");
  }
  acConnection.editorCreated();

  const socket = new ClassicPreset.Socket("socket");

  if (typeof catchNewElementInfo === "undefined") {
    await DG.LoadObject("catchNewElementInfo");
  }
  const elementTypes: string = await catchNewElementInfo.getElementTypes();
  dock.add (() => new CatchNewElementNode(socket, elementTypes));

  setTimeout(() => {
    // wait until nodes rendered because they dont have predefined width and height
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 10);
  return {
    destroy: () => area.destroy(),
  };
}

window.addEventListener("load", (event) => {
  const editorContainer = document.getElementById("container");
  if (editorContainer) {
    console.log("Creating editor");
    createEditor(editorContainer);
  }
  // const container = document.getElementById("container")!;
  // const observer = new MutationObserver((mutationsList, observer) => {
  //   for (const mutation of mutationsList) {
  //     if (mutation.type === 'childList') {
  //       const editorContainer = document.getElementById("editor-container");
  //       if (editorContainer) {
  //         createEditor(editorContainer);
  //         observer.disconnect();
  //       }
  //     }
  //   }
  // });

  // observer.observe(container, { childList: true, subtree: true });
  // addSideMenu(container, () => {});
});