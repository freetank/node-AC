import * as React from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { createRoot } from 'react-dom/client';
import { Content } from 'antd/es/layout/layout';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface SideMenuProps {
  handleClick: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ handleClick }) => {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        className="side-menu"
      >
        <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
          <Menu.Item key="1">option1</Menu.Item>
          <Menu.Item key="2">option2</Menu.Item>
          <Menu.Item key="3">option3</Menu.Item>
          <Menu.Item key="4">option4</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
          <Menu.Item key="5">option5</Menu.Item>
          <Menu.Item key="6">option6</Menu.Item>
          <Menu.Item key="7">option7</Menu.Item>
          <Menu.Item key="8">option8</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
          <Menu.Item key="9">option9</Menu.Item>
          <Menu.Item key="10">option10</Menu.Item>
          <Menu.Item key="11">option11</Menu.Item>
          <Menu.Item key="12">option12</Menu.Item>
        </SubMenu>
      </Menu>
      <div className="fixed-bottom">
        <Button type="primary" block onClick={handleClick}>Run</Button>
      </div>
    </Sider>
  );
};

export function addSideMenu (container: HTMLElement, handleClick: (() => void)) {
  createRoot(container).render(
  <Layout className="layout-full-height">
    <SideMenu handleClick={handleClick}/>
    <Layout>
    <Content>
      <div className="full-height" id="editor-container"></div>
    </Content>
    </Layout>
  </Layout>
  );
}