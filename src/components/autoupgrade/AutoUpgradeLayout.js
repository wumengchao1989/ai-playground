import React from "react";
import {
  Layout,
  Tooltip,
  Card,
  FloatButton,
  Input,
  Button,
  Spin,
  Select,
} from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SendOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/a11y-dark.css";
import "./diff2html.min.css";
import "./index.css";
import Editor, { DiffEditor } from "@monaco-editor/react";
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
  const [contentType, setContentType] = React.useState("1");
  const contentRef = React.useRef("");

  const handleEditorChange = (v, ref) => {
    setFileContent(v);
    const distance = levenshtein(ref.current, v);
    const similarity =
      (1 - distance / Math.max(ref.current.length, v.length)) * 100;
    setContentSimilarity(Math.floor(similarity));
  };

  const handleCateSelect = (v) => {
    setContentType(v);
  };

  const handleSaveAndCommit = () => {
    setTextAreaLoading(true);
    post("/autoupgrade/send_request", {
      message: prompt,
    }).then((res) => {
      if (res.success) {
        contentRef.current = res.result;
        setOriginFileContent(res.result);
        setFileContent(res.result);
        setContentSimilarity(100);
        setTextAreaLoading(false);
        setPrompt("");
      }
    });
  };
  const handleEditorMount = (editor, contentRef) => {
    const modifiedEditor = editor.getModifiedEditor();
    modifiedEditor.onDidChangeModelContent((_) => {
      handleEditorChange(modifiedEditor.getValue(), contentRef);
    });
  };
  const saveToADO = () => {
    post(
      "/dashboard/api/ai/ado/workitem",
      {
        title: "First Test",
        chatpwc: contentSimilarity >= 80 ? "Yes" : "No",
        chatpwcAutomated: "No",
        description: fileContent,
      },
      "https://devopsdashboarddev.pwcinternal.com"
    );
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
          <Layout>
            <Content
              style={{
                display: "flex",
                justifyContent: "left",
                height: "100%",
              }}
            >
              <Card
                type="inner"
                title="AI Generated Content"
                style={{
                  marginTop: 16,
                  marginRight: 8,
                  marginLeft: 48,
                  width: 300,
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
              <Card
                type="inner"
                title="Corrected Content"
                style={{ marginTop: 16, marginRight: 8 }}
              >
                <DiffEditor
                  language={"markdown"}
                  height={320}
                  width={850}
                  original={originFileContent}
                  modified={fileContent}
                  onMount={(_) => handleEditorMount(_, contentRef)}
                />
                {/* <Editor
                  onChange={handleEditorChange}
                  language={"markdown"}
                  height={320}
                  width={570}
                  value={fileContent}
                /> */}
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
              <Select
                value={contentType}
                style={{ width: 200, marginBottom: 8 }}
                onSelect={handleCateSelect}
                options={[
                  {
                    value: "0",
                    label: "User Story",
                  },
                  {
                    value: "1",
                    label: "Test Case",
                  },
                ]}
              ></Select>
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
