import * as React from 'react';
import { Button, Dropdown, Space } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { DropDownControl } from "./dropdownControl";

export const CustomDropDown: React.FC<{ data: DropDownControl }> = ({ data }) => {
  return (
	<Dropdown menu={data.menuProps}>
	  <Button>
		<Space>
		  ButtonCustom
		  <DownOutlined />
		</Space>
	  </Button>
	</Dropdown>
  );
};