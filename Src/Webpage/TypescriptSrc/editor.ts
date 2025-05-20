import { createRoot } from "react-dom/client";
import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets
} from "rete-connection-plugin";
import { ReactPlugin, Presets } from "rete-react-plugin";
import { Schemes, AreaExtra } from "./nodes/nodeTypes";
import { DockPlugin } from "rete-dock-plugin";
import { DropDownControl } from "./dropdownControl";
import { CustomDropDown } from "./dropdownControlUI";
import { CatchNewElementInfo, ACConnection, ScriptBuilder } from "./ACObjectTypes";
import { ControlFlowEngine, DataflowEngine } from "rete-engine";
import { getConnectionSockets } from "./sockets";
import { CatchNewElementNode } from "./nodes/catchNewElementNode";
import { GetSlabNode } from "./nodes/getSlabNode";
import { LayoutGenerator } from "./nodes/layoutGenerator";
import { addSideMenu } from "./sideMenu";
import { StartNode } from "./nodes/startNode";
import { DockPreset } from "./nodes/dockPreset";

declare var DG: any;
declare var catchNewElementInfo: CatchNewElementInfo;
declare var acConnection: ACConnection;
declare var scriptBuilder: ScriptBuilder;

async function loadACObjects() {
  if (typeof catchNewElementInfo === "undefined") {
    await DG.LoadObject("catchNewElementInfo");
  }
  if (typeof acConnection === "undefined") {
    await DG.LoadObject("acConnection");
  }

  if (typeof scriptBuilder === "undefined") {
    await DG.LoadObject("scriptBuilder");
  }
}

class EditorController {
  private static instance: EditorController | null = null;
  public editor: NodeEditor<Schemes>
  public controlFlowEngine: ControlFlowEngine<Schemes>
  public dataFlowEngine: DataflowEngine<Schemes>

  private constructor() {
    this.editor = new NodeEditor<Schemes>();
    this.controlFlowEngine = new ControlFlowEngine<Schemes>();
    this.dataFlowEngine = new DataflowEngine<Schemes>();
  }

  static getInstance(): EditorController {
    if (!EditorController.instance) {
      EditorController.instance = new EditorController();
    }
    return EditorController.instance;
  }
}

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
  dock.addPreset(new DockPreset());

  const editorController = EditorController.getInstance();
  editorController.editor = new NodeEditor<Schemes>();
  editorController.editor.addPipe((context) => {
    if (context.type === "connectioncreate") {
      const { data } = context;
      const { source, target } = getConnectionSockets(editorController.editor, data);

      if (!source.isCompatibleWith(target)) {
        console.log("Sockets are not compatible", "error");
        return;
      }
    }
    return context;
  });

  editorController.editor.use(area);
  editorController.editor.use(editorController.dataFlowEngine);
  editorController.editor.use(editorController.controlFlowEngine);
  area.use(connection);
  area.use(render);
  area.use(dock);

  await loadACObjects();
  const elementTypes: string = await catchNewElementInfo.getElementTypes();
  dock.add (() => new CatchNewElementNode(elementTypes, editorController.dataFlowEngine));
  dock.add (() => new GetSlabNode(editorController.dataFlowEngine));
  dock.add (() => new LayoutGenerator(editorController.dataFlowEngine));

  AreaExtensions.simpleNodesOrder(area);

  acConnection.editorCreated();

  setTimeout(() => {
    // wait until nodes rendered because they dont have predefined width and height
    AreaExtensions.zoomAt(area, editorController.editor.getNodes());
  }, 10);
  return {
    destroy: () => area.destroy(),
  };
}

function handleClick () {
  console.log ("Clicked");
  const editorController = EditorController.getInstance();
  const startNodes = editorController.editor
    .getNodes()
    .filter((value: ClassicPreset.Node) => value instanceof StartNode);

  for (const node of startNodes) {
    console.log("Node ID: ", node.id);
    editorController.controlFlowEngine.execute(node.id);
  }
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
  addSideMenu(container, handleClick);
});