import * as React from 'react';
import { Button, Dropdown, MenuProps, message, Space } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { DropDownControl } from "./dropdownControl";

const handleMenuClick: MenuProps['onClick'] = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};

const items: MenuProps['items'] = [
  {
	label: '1st menu item',
	key: '1',
  },
  {
	label: '2nd menu item',
	key: '2',
  },
  {
	label: '3rd menu item',
	key: '3',
  },
  {
	label: '4rd menu item',
	key: '4',
  },
];

const menuProps = {
  items,
  onClick: handleMenuClick,
};

export const CustomDropDown: React.FC<{ data: DropDownControl }> = ({ data }) => {
  return (
	<Dropdown menu={menuProps}>
	  <Button>
		<Space>
		  ButtonCustom
		  <DownOutlined />
		</Space>
	  </Button>
	</Dropdown>
  );
};