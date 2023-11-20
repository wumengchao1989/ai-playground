import React from "react";
import { Layout, FloatButton, Spin } from "antd";
import ReactPlayer from "react-player/lazy";
import containerClient from "./utils";
import { AudioOutlined } from "@ant-design/icons";
import recorder from "./recorder";
import ChatBox from "../chatbox/ChatBox";
import { v4 as uuidv4 } from "uuid";

const { Content } = Layout;

const AiInstructor = () => {
  const [pressDown, setPressDown] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const recordStart = () => {
    setPressDown(true);
    recorder.start().then(
      async () => {
        const sleep = (m) => {
          return new Promise((r) => setTimeout(r, m));
        };
        await sleep(5000);
        let wavBlob = recorder.getWAVBlob();
        const bolbName = `speech004-${uuidv4()}.wav`;
        const blockBlobClient = containerClient.getBlockBlobClient(bolbName);
        blockBlobClient.uploadData(wavBlob).then((res) => {
          if (res._response.status === 201) {
            /* post("/illustarte/send_illustrate_message", { bolbName }).then(
              (res) => {}
            ); */
          }
        });
      },
      (error) => {
        // 出错了
        console.log(error);
      }
    );
  };
  const recordEnd = () => {
    recorder.stop();
    setPressDown(false);
    setShowLoading(true);
  };
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
        <div style={{ display: "flex", width: "100%" }}>
          <ReactPlayer
            width={400}
            height={500}
            url="/avatarvideo.mp4"
            loop
            muted
            playing={playing}
          />
          <div style={{ width: "80%", height: 980 }}>
            {showLoading ? (
              <Spin
                style={{ position: "absolute", left: "50%", top: "50%" }}
                size="large"
              />
            ) : (
              ""
            )}
            <ChatBox
              noMessageInput
              isIllustrate
              setPlaying={setPlaying}
              setShowLoading={setShowLoading}
            />
          </div>
        </div>
        <FloatButton
          type="danger"
          icon={<AudioOutlined style={{ color: "#fff" }} />}
          onMouseDown={recordStart}
          onMouseUp={recordEnd}
          onBlur={() => console.log("blur")}
          style={
            pressDown
              ? { boxShadow: "none", backgroundColor: "#f5222d" }
              : { backgroundColor: "#ff4d4f" }
          }
        >
          record
        </FloatButton>
      </Content>
    </Layout>
  );
};

export default AiInstructor;
