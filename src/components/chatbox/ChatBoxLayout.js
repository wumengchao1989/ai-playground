import React from "react";
import ChatBox from "./ChatBox";
import { Layout, Spin } from "antd";
import Navigation from "../navigation/Navigation";

const { Sider, Content } = Layout;

const ChatBoxLayout = () => {
  const [loading, setLoading] = React.useState(false);
  return (
    <div style={{ height: "100%" }}>
      <Spin
        spinning={loading}
        tip="Please wait bot initialization..."
        style={{ height: "100%" }}
      >
        <Layout hasSider>
          <Sider width={200} style={{ background: "#fff", height: "100%" }}>
            <Navigation setLoading={setLoading} />
          </Sider>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: "100%",
              background: "#fff",
            }}
          >
            <ChatBox />
          </Content>
        </Layout>
      </Spin>
    </div>
  );
};

export default ChatBoxLayout;
