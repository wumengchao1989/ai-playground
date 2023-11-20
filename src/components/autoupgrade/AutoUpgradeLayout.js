import React from "react";
import { Layout, Tooltip, Card, FloatButton, Input, Button, Spin } from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/a11y-dark.css";
import "./diff2html.min.css";
import "./index.css";
import Editor from "@monaco-editor/react";
import { post } from "../../axios";
import levenshtein from "js-levenshtein";
const { Content, Footer } = Layout;

const { TextArea } = Input;

const AutoUpgradeLayout = () => {
  const [originFileContent, setOriginFileContent] = React.useState("");
  const [fileContent, setFileContent] = React.useState("");
  const [contentSimilarity, setContentSimilarity] = React.useState(100);
  const [prompt, setPrompt] = React.useState("");
  const [textareaLoading, setTextAreaLoading] = React.useState(false);

  const handleEditorChange = (v) => {
    setFileContent(v);
    const distance = levenshtein(originFileContent, v);
    const similarity =
      (1 - distance / Math.max(originFileContent.length, v.length)) * 100;
    setContentSimilarity(Math.floor(similarity));
  };

  const handleSaveAndCommit = () => {
    setTextAreaLoading(true);
    post("/autoupgrade/send_request", {
      message: prompt,
    }).then((res) => {
      if (res.success) {
        setOriginFileContent(res.result);
        setFileContent(res.result);
        setContentSimilarity(100);
        setTextAreaLoading(false);
      }
    });
  };
  const saveToADO = () => {
    post(
      "/dashboard/api/ai/ado/workitem",
      {
        title: "this is a test case 3",
        chatpwc: "Yes",
        chatpwcAutomated: "No",
        description: "aaa",
      },
      "https://devopsdashboarddev.pwcinternal.com"
    );
  };

  /* const handleShowAnalysisModal = () => {
    setShowModal(true);
    get("/autoupgrade/get_diff_analysis", {
      targetCommitId,
      path: currentFilePath,
    }).then((res) => {
      if (res.success) {
        setDiffAnalysisContent(res.res.choices[0].message.content);
      }
    });
  }; */

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
          <Layout>
            <Content
              style={{
                display: "flex",
                justifyContent: "left",
                height: "100%",
              }}
            >
              <Card
                style={{
                  marginTop: 16,
                  marginRight: 8,
                  marginLeft: 48,
                  width: 570,
                  overflow: "scroll",
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                  children={originFileContent}
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
              </Card>
              <Card style={{ marginTop: 16, marginRight: 8 }}>
                <Editor
                  onChange={handleEditorChange}
                  language={"markdown"}
                  height={400}
                  width={570}
                  value={fileContent}
                />
              </Card>
              <Card style={{ marginTop: 16, width: 132 }}>
                <h4>Current Similarity: </h4>
                <div>{contentSimilarity} %</div>
                <Button
                  onClick={saveToADO}
                  style={{ marginTop: 16 }}
                  type="primary"
                >
                  Save
                </Button>
              </Card>

              <Tooltip title="Submit">
                <FloatButton
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSaveAndCommit}
                  style={{ right: 30, bottom: 100 }}
                ></FloatButton>
              </Tooltip>
            </Content>
            <Footer>
              <Spin spinning={textareaLoading}>
                <TextArea
                  placeholder="Please enter your prompt"
                  style={{ height: 100 }}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onPressEnter={handleSaveAndCommit}
                  readOnly={textareaLoading}
                />
              </Spin>
            </Footer>
          </Layout>
        </Layout>
      </Content>
    </Layout>
  );
};

export default AutoUpgradeLayout;
