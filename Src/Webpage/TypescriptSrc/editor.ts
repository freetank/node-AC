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
import { MenuProps } from "antd";
import { Menu } from "rete-react-plugin/_types/presets/context-menu/components/Menu";

declare interface CatchNewElementInfo {
  getElementTypes(): any; 
}

declare interface ACConnection {
  editorCreated (): void;
}

declare var catchNewElementInfo: CatchNewElementInfo;
declare var acConnection: ACConnection;
declare var DG: any;

function loadALLObjectFromAC () {
  return new Promise<void>((resolve, reject) => {
    const pACConnection = loadObject("acConnection", acConnection);
    const pCatchNewElementInfo = loadObject("catchNewElementInfo", catchNewElementInfo);

    Promise.all([pACConnection, pCatchNewElementInfo]).then(() => {
      resolve();
    }).catch(() => {
      reject();
    });
  });
}

function loadObject(objectName: string, object: any) {
  return new Promise<void>((resolve, reject) => {
    if (typeof object !== "undefined") {
      resolve();
      return;
    }

    const tryLoadObject = (retries: number, delay: number) => {
      if (retries <= 0) {
        reject();
        return;
      }

      DG.LoadObject(objectName);

      if (typeof object !== "undefined") {
        resolve();
        return;
      }

      setTimeout(() => {
          tryLoadObject(retries - 1, delay);
        }, delay);
    };

    tryLoadObject(20, 500);
  });
}

async function createEditor(container: HTMLElement) {
  const pLoadAllObject = loadALLObjectFromAC ();

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

  await pLoadAllObject; // TODO handle rejection
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
  createEditor (container);
});

// Define the interfaces
interface Element {
  name: string;
  ID: number;
}

interface ElementType {
  element: Element;
}

interface ElementTypes {
  elementTypes: ElementType[];
}

function toMenuProps (elementTypesJSON: any) : MenuProps['items'] {
  const data: ElementTypes = JSON.parse(elementTypesJSON);

  let items: MenuProps['items'] = new Array ();
  data.elementTypes.forEach(elementType => {
    items.push ({
      label: elementType.element.name,
      key: elementType.element.ID.toString(),
    });
  });

  return items;
}


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

  const dropdown = new Node("Event: Catch new element");
  dropdown.addControl("dropdown", new DropDownControl(toMenuProps (await catchNewElementInfo.getElementTypes())));
  dropdown.addOutput("dropdown", new ClassicPreset.Output(socket));
  await editor.addNode(dropdown);

  await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));

  await area.translate(a.id, { x: 0, y: 0 });
  await area.translate(b.id, { x: 270, y: 0 });
}