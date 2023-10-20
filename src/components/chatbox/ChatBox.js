import React, { useEffect, useState } from "react";
import { Avatar, Divider, List, Skeleton, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style/Chatbox.scss";
import ClassNames from "classnames";
import { get, post } from "../../axios";
import { useParams } from "react-router-dom";
import { Input } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

const chatId = "64ffef6ece40662d8a3069c7";

const { TextArea } = Input;
const ChatBox = (props) => {
  const { noMessageInput, isIllustrate, setPlaying, setShowLoading } = props;
  const { chatid } = useParams();
  const [data, setData] = useState([]);
  const [textareaLoading, setTextAreaLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const currentDataRef = React.useRef([]);
  const loadMoreData = () => {
    if (chatid) {
      get("/copilot/get_chat_groups", { id: chatid }).then((res) => {
        if (res.success === true) {
          if (res.res && res.res.chatMessages) {
            setData(
              res.res.chatMessages.filter((msg) => msg.role !== "system")
            );
            currentDataRef.current = res.res.chatMessages;
          } else {
            setData([]);
          }
        }
      });
    }
  };

  useEffect(() => {
    if (!isIllustrate) return;
    get("/illustrate/get_illustrate_chat_groups", { id: chatId }).then(
      (res) => {
        if (res.success === true) {
          if (res.res && res.res.chatMessages) {
            setData(res.res.chatMessages);
            currentDataRef.current = res.res.chatMessages;
          } else {
            setData([]);
          }
        }
      }
    );
    setInterval(() => {
      get("/coach/illustrate/get_illustrate_chat_groups", { id: chatId }).then(
        (res) => {
          if (res.success === true) {
            if (res.res && res.res.chatMessages) {
              console.log(currentDataRef.current);
              const currentMessageCount = currentDataRef.current.filter(
                (item) => item.reverse === true
              ).length;
              const nextCurrentMessageCount = res.res.chatMessages.filter(
                (item) => item.reverse === true
              ).length;
              setData(res.res.chatMessages);
              if (nextCurrentMessageCount === currentMessageCount + 1) {
                setShowLoading(false);
              }
            } else {
              setData([]);
            }
          }
        }
      );
    }, 2000);
  }, []);
  useEffect(() => {
    loadMoreData();
  }, [chatid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTextAreaLoading(true);
    const tempData = Array.from(data);
    tempData.push({
      role: "user",
      message: inputValue,
      createAt: new Date(),
      userName: "Mark",
      reverse: false,
    });
    setData(tempData);
    post("/copilot/send_request", {
      prompt: inputValue,
      chatGroupId: chatid,
    }).then((res) => {
      if (res.success === true) {
        loadMoreData();
        setTextAreaLoading(false);
        setInputValue("");
      }
    });
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const itemRenderer = (item, index) => {
    const listItemClassnames = ClassNames({ reverse: !item.reverse });
    return (
      <List.Item key={index} className={listItemClassnames}>
        <List.Item.Meta
          avatar={
            <Avatar
              style={{
                backgroundColor:
                  item.role === "assistant" ? "#1677ff" : "#87d068",
              }}
            >
              {item.userName}
            </Avatar>
          }
          title={item.userName}
          description={
            <div>
              <ReactMarkdown
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                children={item.message}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        children={String(children).replace(/\n$/, "")}
                        style={darcula}
                        language={match[1]}
                        PreTag="div"
                      />
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
              {/* {item.reverse && isIllustrate ? (
                <ReactAudioPlayer
                  src={`http://localhost:8081/audio/${item.bolbUrl}`}
                  controls
                  autoPlay
                  onPlay={() => {
                    setPlaying(true);
                  }}
                  onEnded={() => setPlaying(false)}
                  onPause={() => setPlaying(false)}
                />
              ) : (
                ""
              )} */}
            </div>
          }
        />
      </List.Item>
    );
  };
  return (
    <div className="chatboxContainer">
      <div id="scrollableDiv" className="listboxContainer">
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={false}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List dataSource={data} renderItem={itemRenderer} />
        </InfiniteScroll>
      </div>
      {noMessageInput ? (
        ""
      ) : (
        <div className="textAreaContainer">
          <Spin spinning={textareaLoading}>
            <TextArea
              placeholder="Please enter text you want to ask..."
              value={inputValue}
              onChange={handleChange}
              autoSize={{ maxRows: 8, minRows: 8 }}
              onPressEnter={handleSubmit}
            />
          </Spin>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
