import React, { useEffect } from "react";
import { Layout, Tree, Button, Empty, Modal, Progress } from "antd";
const { DirectoryTree } = Tree;
import hljs from "highlight.js";
import "highlight.js/styles/a11y-dark.css";
import "./diff2html.min.css";
import "./index.css";
import { get, post } from "../../axios";
import { Spin } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const { Content, Sider } = Layout;
const endSuffix = "$$$$$$end$$$$$$";
const AutoUpgradeLayout = () => {
  const progressInfoTemp = [
    {
      title: "Update",
      percent: 0,
      showLoading: false,
      isCompleted: false,
    },
    {
      title: "Build",
      percent: 0,
      showLoading: false,
      isCompleted: false,
    },
    {
      title: "Code Scan",
      percent: 0,
      showLoading: false,
      isCompleted: false,
    },
    {
      title: "Test",
      percent: 0,
      showLoading: false,
      isCompleted: false,
    },
  ];
  const [currentPhase, setCurrentPhase] = React.useState("0");
  const [fileList, setFileList] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [fileContent, setFileContent] = React.useState("");

  const initialUpgradeLogs = "Upgrade process start...";
  const [upgradeLogs, setUpgradeLogs] = React.useState(initialUpgradeLogs);
  const initialInstallLogs = "Install process start...";

  const [installLogs, setInstallLogs] = React.useState(initialInstallLogs);
  const initialTestLogs = "Cypress test process start...";
  const [testLogs, setTestLogs] = React.useState(initialTestLogs);
  const initialBuildLogs = "Build process start...";
  const [buildLogs, setBuildLogs] = React.useState(initialBuildLogs);
  const [logIndex, setLogIndex] = React.useState("0");
  const [progressInfo, setProgressInfo] = React.useState(progressInfoTemp);
  const [upgradeProgress, setUpgradeProgress] = React.useState(0);
  const upgradeCidRef = React.useRef();
  const installCidRef = React.useRef();
  const buildCidRef = React.useRef();
  const testCidRef = React.useRef();
  const currentPhaseRef = React.useRef(currentPhase);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const getFileList = () => {
    get("/autoupgrade/get_file_list").then((res) => {
      if (res.success === true) {
        const nextFileList = res.res.filter((item) => item !== null);
        setFileList(nextFileList);
      }
    });
  };
  const getProgressPhase = () => {
    get("/autoupgrade/get_progress_phase").then((res) => {
      if (res.success === true) {
        const phase = res.result.phase;
        const currentProgressInfo = progressInfo;
        const prevPhase = currentPhaseRef.current;
        if (phase && Number(prevPhase) < Number(phase) && Number(phase) <= 4) {
          currentProgressInfo[Number(prevPhase)].isCompleted = true;
          currentProgressInfo[Number(prevPhase)].percent = 100;
          if (currentProgressInfo[Number(prevPhase)])
            currentProgressInfo[Number(prevPhase)].showLoading = false;
          if (currentProgressInfo[Number(phase)])
            currentProgressInfo[Number(phase)].showLoading = true;
          setProgressInfo(currentProgressInfo);
          setCurrentPhase(phase);
          setUpgradeProgress(Number(phase) * 25);
          currentPhaseRef.current = phase;
          switch (phase) {
            case "1":
              triggerRunInstall();
              break;
            case "2":
              triggerRunBuild();
              break;
            case "3":
              triggerCypressTest();
              break;
            default:
              break;
          }
        }
      }
    });
  };
  const getUpdateProgress = () => {
    get("/autoupgrade/get_update_progress").then((res) => {
      if (res.success) {
        const logs = res.res.updatedFileList.map((item) => {
          return `${item.key} updated at: ${item.value}\n`;
        });
        setUpgradeLogs(`${initialUpgradeLogs}\n` + logs.join(""));
        const nextProgressInfoTemp = progressInfoTemp;
        nextProgressInfoTemp[0].percent += 2;
        setProgressInfo(nextProgressInfoTemp);
      }
    });
  };

  useEffect(() => {
    document.querySelectorAll("code").forEach((block) => {
      try {
        hljs.highlightBlock(block);
      } catch (e) {
        console.log(e);
      }
    });
  }, [modalOpen]);

  useEffect(() => {
    getFileList();
    upgradeCidRef.current = setInterval(() => {
      getFileList();
    }, 5000);
    return () => {
      clearInterval(upgradeCidRef.current);
      clearInterval(buildCidRef.current);
      clearInterval(testCidRef.current);
    };
  }, []);
  useEffect(() => {
    setInterval(() => {
      getProgressPhase();
    }, 5000);
  }, []);

  const triggerUpdate = () => {
    post("/autoupgrade/trigger_upgrade");
    upgradeCidRef.current = setInterval(() => {
      getUpdateProgress();
    }, 5000);
  };

  const triggerRunInstall = () => {
    clearInterval(upgradeCidRef.current);
    setLogIndex("1");
    post("/autoupgrade/trigger_install").then((res) => {
      if (res.success) {
        installCidRef.current = setInterval(() => {
          get("/autoupgrade/get_install_logs", { id: res.res.id }).then(
            (res) => {
              if (res.success) {
                const installLogsText = res.res.installLogs;
                setInstallLogs(`${initialInstallLogs}\n` + installLogsText);
              }
            }
          );
        }, 4000);
      }
    });
  };

  const triggerRunBuild = () => {
    setLogIndex("2");
    clearInterval(upgradeCidRef.current);
    post("/autoupgrade/trigger_build").then((res) => {
      if (res.success) {
        buildCidRef.current = setInterval(() => {
          get("/autoupgrade/get_build_logs", { id: res.res.id }).then((res) => {
            if (res.success) {
              const buildLogsText = res.res.buildLogs;
              if (buildLogsText.indexOf(endSuffix) !== -1) {
                clearInterval(buildCidRef.current);
              }
              setBuildLogs(`${initialBuildLogs}\n` + buildLogsText);
            }
          });
        }, 1500);
      }
    });
  };

  const triggerCypressTest = () => {
    setLogIndex("3");
    clearInterval(upgradeCidRef.current);
    post("/autotest/trigger_cypress_test").then((res) => {
      if (res.success) {
        testCidRef.current = setInterval(() => {
          get("/autotest/get_cypress_test_logs", { id: res.res.id }).then(
            (res) => {
              if (res.success) {
                const testLogsText = res.res.testLogs;
                setTestLogs(`${initialTestLogs}\n` + testLogsText);
              }
            }
          );
        }, 1500);
      }
    });
  };

  const handleSelect = (key, item) => {
    if (item.node.isLeaf) {
      get("/autoupgrade/get_diff_html_string", { path: key }).then((res) => {
        if (res.success && res.diff !== "") {
          setFileContent(res.res);
        } else {
          setFileContent("");
        }
      });
    }
  };

  const openUpgradeModal = () => {
    setModalOpen(true);
    const nextProgressInfoTemp = progressInfoTemp;
    nextProgressInfoTemp[0].showLoading = true;
    setProgressInfo(nextProgressInfoTemp);
  };

  const handleClickProgress = (index) => {
    setLogIndex(String(index));
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
              <Button
                type="primary"
                disabled={fileList.length === 0}
                onClick={() => {
                  if (!isProcessing) {
                    confirm({
                      title: "Do you want to start upgrade process?",
                      icon: <ExclamationCircleFilled />,
                      content:
                        "When clicked the OK button, the ai upgrade process will start",
                      onOk() {
                        openUpgradeModal();
                        triggerUpdate();
                        setIsProcessing(true);
                      },
                      onCancel() {},
                    });
                  } else {
                    setModalOpen(true);
                  }
                }}
              >
                Start Upgrade
              </Button>
            </div>
          </Sider>
          <Content
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            {fileContent ? (
              <div
                style={{ height: "100%", overflow: "scroll" }}
                dangerouslySetInnerHTML={{ __html: fileContent }}
              ></div>
            ) : (
              <Empty
                description="No Changes in this file"
                imageStyle={{ height: 450 }}
              />
            )}
            <Modal
              onCancel={() => setModalOpen(false)}
              open={modalOpen}
              width={1500}
              bodyStyle={{ height: 700, paddingTop: 16 }}
              title="Update Process"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: 32,
                  alignItems: "center",
                }}
              >
                {progressInfo.map((item, index) => {
                  return (
                    <>
                      <Progress
                        format={() => item.title}
                        type="circle"
                        percent={item.percent}
                        size={80}
                        onClick={() => handleClickProgress(index)}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        {item.showLoading ? (
                          <Spin style={{ marginBottom: 8 }} />
                        ) : (
                          ""
                        )}
                        <div
                          style={{
                            height: 2,
                            width: 200,
                            background: "#4096ff",
                            marginBottom: item.showLoading ? 24 : 0,
                          }}
                        ></div>
                      </div>
                    </>
                  );
                })}
                <Progress type="circle" percent={upgradeProgress} size={64} />
              </div>
              <pre
                className="code"
                style={{
                  height: "100%",
                  overflowY: "scroll",
                  background: "#000",
                }}
              >
                {logIndex}
                <code style={{ height: "100%" }}>
                  {logIndex === "0"
                    ? upgradeLogs
                    : logIndex === "1"
                    ? installLogs
                    : logIndex === "2"
                    ? buildLogs
                    : testLogs}
                </code>
              </pre>
            </Modal>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default AutoUpgradeLayout;
