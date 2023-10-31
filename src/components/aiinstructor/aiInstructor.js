import React, { useEffect } from "react";
import { Layout, FloatButton, Spin, Modal, Input } from "antd";
import ReactPlayer from "react-player/lazy";
import containerClient from "./utils";
import { AudioOutlined } from "@ant-design/icons";
import recorder from "./recorder";
import ChatBox from "../chatbox/ChatBox";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
const { TextArea } = Input;
const { Content } = Layout;

import { post } from "../../axios";
const urlMap = new Map();
urlMap.set("Michael", "/michale.mp4");
urlMap.set("Shawni", "/shawni.mov");
urlMap.set("Jeff", "/jeff.mov");
urlMap.set("Virtual Assistant", "/virtual_assistant.mov");
const AiInstructor = () => {
  const [pressDown, setPressDown] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const location = useLocation();
  const [chatGroupId, setChatGroupId] = React.useState("");
  const playerRef = React.useRef(null);

  useEffect(() => {
    post("/coach/illustarte/add_illustrate_chat_groups", {
      chatGroupTitle: location.state.name,
    }).then((res) => {
      setChatGroupId(res.res._id);
    });
  }, []);

  const sendTextMessage = (e) => {
    const value = e.target.value;
    post("/coach/illustarte/send_illustrate_message", {
      bolbName: "",
      chatGroupId,
      isSpeech: false,
      text: value,
    });
  };

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
            post("/coach/illustarte/send_illustrate_message", {
              bolbName,
              chatGroupId,
              isSpeech: true,
            });
          }
        });
      },
      (error) => {
        // 出错了
        console.log("Error", error);
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
          position: "relative",
        }}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <ReactPlayer
            width={400}
            height={500}
            url={urlMap.get(location.state.name)}
            loop
            muted
            playing={playing}
            ref={playerRef}
          />
          <div
            style={{
              width: "80%",
              height: 500,
              marginLeft: 24,
            }}
          >
            {showLoading ? (
              <Spin
                style={{ position: "absolute", left: "50%", top: "50%" }}
                size="large"
              />
            ) : (
              ""
            )}
            <ChatBox
              chatGroupId={chatGroupId}
              noMessageInput
              isIllustrate
              setPlaying={setPlaying}
              setShowLoading={setShowLoading}
              videoPlayerRef={playerRef}
            />
            <TextArea
              style={{
                height: "20%",
                width: "70%",
                position: "absolute",
                bottom: 8,
              }}
              placeholder="Enter questins you want to ask"
              onPressEnter={sendTextMessage}
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
          disabled={showLoading}
        >
          record
        </FloatButton>
      </Content>
    </Layout>
  );
};

export default AiInstructor;
