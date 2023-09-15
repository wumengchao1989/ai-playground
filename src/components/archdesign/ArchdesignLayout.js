import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

const ArchDesignLayout = () => {
  return (
    <Layout>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: "100%",
          background: "#fff",
        }}
      >
        Arch design
      </Content>
    </Layout>
  );
};

export default ArchDesignLayout;
