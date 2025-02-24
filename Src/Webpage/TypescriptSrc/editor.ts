import { createRoot } from "react-dom/client";
import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets } from "rete-react-plugin";
import { Node, Schemes, AreaExtra } from "./nodeTypes";
import { DropDownControl } from "./dropdownControl";
import { CustomDropDown } from "./dropdownControlUI";
import { CatchNewElementInfo, ACConnection } from "./ACObjectTypes";
import { addSideMenu } from "./sideMenu";

declare var DG: any;
declare var catchNewElementInfo: CatchNewElementInfo;
declare var acConnection: ACConnection;

async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  createRoot (container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

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

  AreaExtensions.simpleNodesOrder(area);

  if (typeof acConnection === "undefined") {
    await DG.LoadObject("acConnection");
  }
  acConnection.editorCreated();

  createDummyExample(editor, area);

  setTimeout(() => {
    // wait until nodes rendered because they dont have predefined width and height
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 10);
  return {
    destroy: () => area.destroy(),
  };
}

window.addEventListener("load", (event) => {
  const container = document.getElementById("container")!;
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const editorContainer = document.getElementById("editor-container");
        if (editorContainer) {
          createEditor(editorContainer);
          observer.disconnect();
        }
      }
    }
  });

  observer.observe(container, { childList: true, subtree: true });
  addSideMenu(container);
});

async function createDummyExample(editor: NodeEditor<Schemes>, area: AreaPlugin<Schemes, AreaExtra>) {
  const socket = new ClassicPreset.Socket("socket");
  const a = new Node("A");
  a.addControl("a", new ClassicPreset.InputControl("text", { initial: "a" }));
  a.addOutput("a", new ClassicPreset.Output(socket));
  await editor.addNode(a);

  const b = new Node("B");
  b.addControl("b", new ClassicPreset.InputControl("text", { initial: "b" }));
  b.addInput("b", new ClassicPreset.Input(socket));
  await editor.addNode(b);

  if (typeof catchNewElementInfo === "undefined") {
    await DG.LoadObject("catchNewElementInfo");
  }
  const dropdown = new Node("Event: Catch new element");
  dropdown.addControl("dropdown", new DropDownControl(await catchNewElementInfo.getElementTypes()));
  dropdown.addOutput("dropdown", new ClassicPreset.Output(socket));
  await editor.addNode(dropdown);

  await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));

  await area.translate(a.id, { x: 0, y: 0 });
  await area.translate(b.id, { x: 270, y: 0 });
}