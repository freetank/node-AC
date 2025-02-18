import { ClassicPreset } from "rete";
import { MenuProps, message } from "antd";

const handleMenuClick: MenuProps['onClick'] = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};

export class DropDownControl extends ClassicPreset.Control {
  menuProps: any
  constructor(items: MenuProps['items']) {
    super();
    const menuProps = {
      items,
      onClick: handleMenuClick,
    };
    this.menuProps = menuProps;
  }
}