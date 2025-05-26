import * as React from 'react';
import { Layout, Button } from 'antd';
import { createRoot } from 'react-dom/client';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';

export function addSideMenu (container: HTMLElement, handleClick: (() => void)) {
  createRoot(container).render(
  <Layout className="layout-full-height">
    <Sider
      width="auto"
      collapsedWidth="auto"
      className="side-menu"
    >
      <div id="dock-container"></div>
      <Button onClick={handleClick} className="fixed-bottom">Run</Button>
    </Sider>
    <Layout>
      <Content>
        <div className="full-height" id="editor-container"></div>
      </Content>
    </Layout>
  </Layout>
  );
}