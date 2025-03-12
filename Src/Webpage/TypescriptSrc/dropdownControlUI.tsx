import * as React from 'react';
import { Button, Dropdown, Space } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { DropDownControl } from "./dropdownControl";

export const CustomDropDown: React.FC<{ data: DropDownControl }> = ({ data }) => {
  const [selectedItem, setSelectedItem] = React.useState(data.selectedItem);
  data.onMenuClickCallback = () => setSelectedItem(data.selectedItem);

  return (
    <Dropdown menu={data.menuProps}>
      <Button>
      <Space>
        {selectedItem.label}
        <DownOutlined />
      </Space>
      </Button>
    </Dropdown>
  );
};