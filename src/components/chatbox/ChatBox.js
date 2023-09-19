import React, { useEffect, useState } from "react";
import { Avatar, Divider, List, Skeleton, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style/Chatbox.scss";
import ClassNames from "classnames";
import { get, post } from "../../axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactAudioPlayer from "react-audio-player";

const ChatBox = (props) => {
  const {
    isIllustrate,
    setPlaying,
    setShowLoading,
    chatGroupId,
    videoPlayerRef,
  } = props;
  const [data, setData] = useState([]);
  const [reverseData, setReverseData] = useState([]);

  const currentDataRef = React.useRef([]);
  const currentChatGroupIdRef = React.useRef(chatGroupId);
  const hasCalledInitRef = React.useRef(false);
  const endRef = React.useRef(null);
  useEffect(() => {
    if (setShowLoading) setShowLoading(false);
  }, [reverseData.length]);

  useEffect(() => {
    scrollToEnd();
    if (setShowLoading) setShowLoading(false);
  }, [data.length]);

  useEffect(() => {
    currentChatGroupIdRef.current = chatGroupId;
  }, [chatGroupId]);

  useEffect(() => {
    get("/coach/illustrate/get_illustrate_chat_groups", {
      id: currentChatGroupIdRef.current,
    }).then((res) => {
      if (res.success === true) {
        if (res.res && res.res.chatMessages) {
          setData(
            res.res.chatMessages.map((item, index) => {
              if (index === res.res.chatMessages.length - 1) {
                return { ...item, autoPlay: true };
              } else {
                return { ...item };
              }
            })
          );
          setReverseData(
            res.res.chatMessages.filter((item) => {
              return item.reverse;
            })
          );
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
          if (
            res.res &&
            res.res.chatMessages &&
            res.res.chatMessages.length !== 0
          ) {
            setData(
              res.res.chatMessages.map((item, index) => {
                if (index === res.res.chatMessages.length - 1) {
                  return { ...item, autoPlay: true };
                } else {
                  return { ...item };
                }
              })
            );
            setReverseData(
              res.res.chatMessages.filter((item) => {
                return item.reverse;
              })
            );
          } else {
            setData([]);
            if (!hasCalledInitRef.current) {
              hasCalledInitRef.current = true;
              post("/coach/illustarte/send_illustrate_message", {
                chatGroupId: currentChatGroupIdRef.current,
                isInit: true,
              });
              if (setShowLoading) setShowLoading(true);
              console.log("send init");
            }
          }
        }
      });
    }, 2000);
  }, []);
  const scrollToEnd = () => {
    if (endRef && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
              {item.reverse && isIllustrate ? (
                <ReactAudioPlayer
                  src={`http://localhost:8084/audio/${item.bolbUrl}`}
                  controls
                  autoPlay={item.autoPlay}
                  onPlay={() => {
                    setPlaying(true);
                    videoPlayerRef.current.seekTo(3, "seconds");
                  }}
                  onEnded={() => {
                    setPlaying(false);
                    videoPlayerRef.current.seekTo(0, "seconds");
                  }}
                  onPause={() => {
                    setPlaying(false);
                    videoPlayerRef.current.seekTo(0, "seconds");
                  }}
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
      <div
        id="scrollableDiv"
        className="listboxContainer"
        style={{ height: "100%" }}
      >
        <InfiniteScroll
          dataLength={data.length}
          hasMore={false}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={
            <div ref={endRef}>
              <Divider plain>It is all, nothing more 🤐</Divider>
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <List dataSource={data} renderItem={itemRenderer} />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatBox;
