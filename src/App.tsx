import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { PdfViewer } from "./components/PdfViewer";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "PAGE1", <PieChartOutlined />),
  // getItem("Option 2", "PAGE2", <DesktopOutlined />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedPage, setSelectedPage] = useState("PAGE1");
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const renderLayout=()=>{
    switch (selectedPage) {
      case "PAGE1":
        return <PdfViewer/>;
      case "PAGE2":
        return <></>;
    }
  }
  return (
    <>
      {/* <Sider
        collapsible
        collapsed={collapsed}
        
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["PAGE1"]}
          mode="inline"
          items={items}
          onClick={(e) => setSelectedPage(e.key)}
        />
      </Sider> */}
      {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
      <Content>
        <div
          style={{
            minHeight: 360,
            background: colorBgContainer,
          }}
        >
          {renderLayout()}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </>
  );
};

export default App;
