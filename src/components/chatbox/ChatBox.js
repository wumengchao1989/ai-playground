import React, { useEffect, useState } from "react";
import { Avatar, Divider, List, Skeleton, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style/Chatbox.scss";
import ClassNames from "classnames";
import { get } from "../../axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactAudioPlayer from "react-audio-player";

const ChatBox = (props) => {
  const { isIllustrate, setPlaying, setShowLoading, chatGroupId } = props;
  const [data, setData] = useState([]);
  const currentDataRef = React.useRef([]);
  const currentChatGroupIdRef = React.useRef(chatGroupId);
  useEffect(() => {
    currentChatGroupIdRef.current = chatGroupId;
  }, [chatGroupId]);
  useEffect(() => {
    get("/coach/illustrate/get_illustrate_chat_groups", {
      id: currentChatGroupIdRef.current,
    }).then((res) => {
      if (res.success === true) {
        if (res.res && res.res.chatMessages) {
          setData(res.res.chatMessages);
          currentDataRef.current = res.res.chatMessages;
        } else {
          setData([]);
        }
      }
    });
    setInterval(() => {
      get("/coach/illustrate/get_illustrate_chat_groups", {
        id: currentChatGroupIdRef.current,
      }).then((res) => {
        if (res.success === true) {
          if (res.res && res.res.chatMessages) {
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
      });
    }, 2000);
  }, []);

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
              {item.reverse && isIllustrate ? (
                <ReactAudioPlayer
                  src={`http://localhost:8084/audio/${item.bolbUrl}`}
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
              )}
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
          hasMore={false}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List dataSource={data} renderItem={itemRenderer} />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatBox;
