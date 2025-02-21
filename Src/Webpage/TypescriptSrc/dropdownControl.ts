import { ClassicPreset } from "rete";
import { MenuProps, message } from "antd";

const handleMenuClick: MenuProps['onClick'] = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};

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

export class DropDownControl extends ClassicPreset.Control {
  menuProps: any
  constructor(itemsJSON: string) {
    super();
    let items = toMenuProps (itemsJSON);
    this.menuProps = {
      items,
      onClick: handleMenuClick,
    };
  }
}