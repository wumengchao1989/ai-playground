import React from "react";
import { Layout } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
const { Content } = Layout;
const domain = process.env.REACT_APP_BASE_URL;

const props = {
  name: "file",
  action: `${domain}/api/coach/illustarte/coach_data_upload`,
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const voice_upload_props = {
  name: "file",
  action: `${domain}/api/coach/illustarte/voice_audio_upload`,
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const CoachDataManagerLayout = () => {
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
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <Upload {...voice_upload_props}>
          <Button icon={<UploadOutlined />}>Click to Upload Audio</Button>
        </Upload>
      </Content>
    </Layout>
  );
};

export default CoachDataManagerLayout;
