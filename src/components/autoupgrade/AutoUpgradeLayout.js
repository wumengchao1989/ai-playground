import React, { useEffect } from "react";
import {
  Layout,
  Tree,
  Empty,
  Tooltip,
  Card,
  FloatButton,
  Select,
  Modal,
  Button,
  Spin,
} from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SaveOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/a11y-dark.css";
import "./diff2html.min.css";
import "./index.css";
import { get, post } from "../../axios";
import Editor from "@monaco-editor/react";
import dayjs from "dayjs";
import { Header } from "antd/es/layout/layout";
const { Content, Sider } = Layout;
const languageMap = {
  js: "javascript",
  ts: "typescript",
  html: "html",
  css: "css",
  scss: "scss",
};
const { DirectoryTree } = Tree;

const AutoUpgradeLayout = () => {
  const [fileList, setFileList] = React.useState([]);
  const [fileContent, setFileContent] = React.useState("");
  const [diffContent, setDiffContent] = React.useState("");
  const [language, setLanguage] = React.useState("html");
  const [currentFilePath, setCurrentFilePath] = React.useState("");
  const [commitList, setCommitList] = React.useState([]);
  const [targetCommitId, setTargetCommitId] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  const [diffAnalysisContent, setDiffAnalysisContent] = React.useState("");
  const upgradeCidRef = React.useRef();

  const getCommitList = () => {
    get("/autoupgrade/get_commit_list").then((res) => {
      if (res.success === true) {
        const commitListOptions = res.res.all.map((item) => {
          return {
            label: `${item.message}-${dayjs(item.date).format(
              "YYYY-MM-DD HH:mm:ss"
            )}`,
            value: item.hash,
          };
        });
        setCommitList(commitListOptions);
        if (res && res.res && res.res.latest) {
          setTargetCommitId(res.res.latest.hash);
        }
      }
    });
  };
  useEffect(() => {
    getCommitList();
  }, []);

  const getFileList = () => {
    get("/autoupgrade/get_file_list").then((res) => {
      if (res.success === true) {
        const nextFileList = res.res.filter((item) => item !== null);
        setFileList(nextFileList);
      }
    });
  };
  const handleEditorChange = (v) => {
    setFileContent(v);
  };

  const handleCommitSelect = (v) => {
    setTargetCommitId(v);
    get("/autoupgrade/get_diff_html_string", {
      targetCommitId: v,
      path: currentFilePath,
    }).then((res) => {
      if (res.success && res.diff !== "") {
        setDiffContent(res.res);
      } else {
        setDiffContent("");
      }
    });
  };

  useEffect(() => {
    getFileList();
    upgradeCidRef.current = setInterval(() => {
      getFileList();
    }, 5000);
    return () => {
      clearInterval(upgradeCidRef.current);
    };
  }, []);

  const handleSaveAndCommit = () => {
    post("/autoupgrade/save_and_commit", {
      path: currentFilePath,
      fileContent,
    });
  };

  const handleShowAnalysisModal = () => {
    setShowModal(true);
    get("/autoupgrade/get_diff_analysis", {
      targetCommitId,
      path: currentFilePath,
    }).then((res) => {
      if (res.success) {
        setDiffAnalysisContent(res.res.choices[0].message.content);
      }
    });
  };

  const handleSelect = (key, item) => {
    if (item.node.isLeaf) {
      get("/autoupgrade/get_diff_html_string", {
        targetCommitId,
        path: key[0],
      }).then((res) => {
        if (res.success && res.diff !== "") {
          setDiffContent(res.res);
        } else {
          setDiffContent("");
        }
      });
      const file_language =
        languageMap[key[0].split(".").pop()] || "javascript";
      setLanguage(file_language);
      setCurrentFilePath(key[0]);

      get("/autoupgrade/get_file_content", { path: key }).then((res) => {
        if (res.success && res.diff !== "") {
          setFileContent(res.res);
        } else {
          setFileContent("");
        }
      });
    }
  };

  return (
    <Layout>
      <Content
        style={{
          paddingTop: 24,
          paddingBottom: 24,
          margin: 0,
          minHeight: "100%",
          background: "#fff",
        }}
      >
        <Layout hasSider style={{ height: "100%" }}>
          <Sider
            width={350}
            style={{
              background: "#fff",
              height: "100%",
              padding: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {fileList.length === 0 ? (
                <Spin tip="Getting File List">
                  <div className="content" />
                </Spin>
              ) : (
                <DirectoryTree
                  defaultExpandAll
                  treeData={fileList}
                  onSelect={handleSelect}
                  titleRender={(nodeData) => {
                    return (
                      <span
                        style={{
                          color: nodeData.isModified ? "#EAB528" : "black",
                        }}
                      >
                        {nodeData.title}
                        {nodeData.isCurrentHandling ? (
                          <Spin style={{ marginLeft: 8 }} size="small" />
                        ) : (
                          ""
                        )}
                      </span>
                    );
                  }}
                />
              )}
            </div>
          </Sider>
          <Layout>
            <Header style={{ backgroundColor: "#1677ff" }}>
              <Select
                style={{ width: 300, marginRight: 16 }}
                options={commitList}
                onSelect={handleCommitSelect}
              ></Select>
              <Button onClick={handleShowAnalysisModal}>Show Analysis</Button>
            </Header>
            <Content
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <div style={{ height: 250, overflowY: "scroll" }}>
                {fileContent ? (
                  <code
                    style={{ height: 200, overflow: "scroll" }}
                    dangerouslySetInnerHTML={{ __html: diffContent }}
                  ></code>
                ) : (
                  <Empty
                    description="No Changes in this file"
                    imageStyle={{ height: 200 }}
                  />
                )}
              </div>
              <Tooltip title="Save and Commit">
                <FloatButton
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveAndCommit}
                >
                  {" "}
                  save
                </FloatButton>
              </Tooltip>
              <Card style={{ marginTop: 16 }}>
                <Editor
                  onChange={handleEditorChange}
                  language={language}
                  height={400}
                  value={fileContent}
                />
              </Card>
            </Content>
          </Layout>
        </Layout>
      </Content>
      <Modal
        destroyOnClose
        title="Diff analysis"
        onCancel={() => {
          setShowModal(false);
          setDiffAnalysisContent("");
        }}
        open={showModal}
        footer={""}
      >
        {diffAnalysisContent ? (
          <ReactMarkdown
            remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
            children={diffAnalysisContent}
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
        ) : (
          <Spin />
        )}
      </Modal>
    </Layout>
  );
};

export default AutoUpgradeLayout;
