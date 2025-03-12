import { ClassicPreset } from "rete";
import { MenuProps, message } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";

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

function toMenuPropsItems(elementTypesJSON: any) : MenuProps['items'] {
  const data: ElementTypes = JSON.parse(elementTypesJSON);

  let items: MenuProps['items'] = new Array ();
  data.elementTypes.forEach(elementType => {
    items.push ({
      label: elementType.element.name,
      key: elementType.element.ID,
    });
  });

  return items;
}

type MenuClickCallbackType = () => void;

export class DropDownControl extends ClassicPreset.Control {
  menuProps: MenuProps;
  selectedItem: any;
  onMenuClickCallback?: MenuClickCallbackType;

  handleMenuClick = (e: MenuInfo, callback: MenuClickCallbackType | undefined) => {
    this.selectedItem = this.menuProps.items?.find(item => item?.key?.toString() == e.key);
    if (callback)
      callback();
  };

  constructor(itemsJSON: string) {
    super();
    let items = toMenuPropsItems(itemsJSON)!;
    this.menuProps = {
      items,
      onClick: (e) => this.handleMenuClick(e, this.onMenuClickCallback)
    };
    this.selectedItem = items[0];
  }
}