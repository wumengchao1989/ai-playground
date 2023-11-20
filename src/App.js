import React from "react";
import {
  Layout,
  Space,
  Menu,
  Avatar,
  Dropdown,
  Modal,
  Form,
  Input,
} from "antd";
import "./App.css";
import { Outlet } from "react-router-dom";
const { Header, Footer } = Layout;
function App() {
  const [showModal, setShowModal] = React.useState(false);
  const handleMenuClick = (e) => {
    setShowModal(true);
  };
  const items1 = [
    //{ key: "1", label: <a href="/chatbox">Appkit Copilot</a> },
    { key: "2", label: <a href="/autoupgrade">AI Maker</a> },
    // { key: "3", label: <a href="/dashboardanalysis">Dashboard Analysis</a> },
    // { key: "4", label: <a href="/archdesign">Architecture Design</a> },
    //{ key: "5", label: <a href="/ai_instructor">Leadership Coach Bot</a> },
    //{ key: "6", label: <a href="/demo">Demo</a> },
  ];
  const items = [
    {
      key: "1",
      label: <span onClick={handleMenuClick}>Config</span>,
    },
    {
      key: "2",
      label: <span>Logout</span>,
    },
  ];
  return (
    <div className="App" style={{ height: "100%" }}>
      <Space
        direction="vertical"
        style={{ width: "100%", height: "100%" }}
        size={[0, 48]}
      >
        <Layout style={{ height: "100%" }}>
          <Header
            style={{
              backgroundColor: "#D04A02",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Menu
              style={{ backgroundColor: "#D04A02", width: 200 }}
              theme="dark"
              mode="horizontal"
              items={items1}
            />
            <Dropdown menu={{ items }}>
              <Avatar
                style={{
                  position: "absolute",
                  right: 16,
                  background: "#1677ff",
                }}
              >
                {"LC"}
              </Avatar>
            </Dropdown>
          </Header>
          <Outlet />
          <Footer style={{ textAlign: "center" }}>
            AI Bot PlayGround ©2023 Created by Mark Wu
          </Footer>
          <Modal
            onCancel={() => setShowModal(false)}
            title={"Config"}
            open={showModal}
            onOk={() => setShowModal(false)}
          >
            <Form
              name="basic"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item
                label="Test Category"
                name="Test Category"
                rules={[{ message: "Please enter test category." }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Automation Status"
                rules={[
                  {
                    message: "Please input  automation status.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Token"
                name="token"
                rules={[{ message: "Please input your token!" }]}
              >
                <Input.Password
                  readOnly
                  defaultValue="sjdjhjskjj&smmdnn3skdjmaasssds232"
                />
              </Form.Item>
            </Form>
          </Modal>
        </Layout>
      </Space>
    </div>
  );
}

export default App;
