import { Avatar, Button, Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../axios";
const { info } = Modal;
const AIInstructorWelcome = () => {
  const navigate = useNavigate();
  const handleNavigate = (item) => {
    navigate("../ai_instructor_inner", {
      state: { id: 1, name: item.name },
    });
  };
  const handleReset = () => {
    /* post("/coach/illustarte/reset_messages").then((res) => {
      if (res.success) {
        info({ title: "reset all messages" });
      }
    }); */
    post("/coach/illustarte/video_data_importer").then((res) => {
      if (res.success) {
        info({ title: "video data has been imported" });
      }
    });
  };
  const AvatarList = [
    {
      name: "Michael",
      imgSrc: "/avatar/avatar001.png",
      path: "",
      bgColor: "#415385",
    },
    {
      name: "Shawni",
      imgSrc: "/avatar/avatar002.png",
      path: "",
      bgColor: "#D04A02",
    },
    {
      name: "Jeff",
      imgSrc: "/avatar/avatar003.png",
      path: "",
      bgColor: "#D04A02",
    },
    {
      name: "Virtual Assistant",
      imgSrc: "/avatar/avatar004.png",
      path: "",
      bgColor: "#26776D",
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 800,
      }}
    >
      {/* <Button
        onClick={handleReset}
        style={{ position: "absolute", top: 16, right: 16 }}
      >
        Reset
      </Button> */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1 style={{ fontSize: 80 }}>Mentor App</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: 800,
          }}
        >
          {AvatarList.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onClick={() => handleNavigate(item)}
              >
                <Avatar
                  src={item.imgSrc}
                  size={164}
                  style={{ backgroundColor: item.bgColor }}
                />
                <h3>{item.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIInstructorWelcome;
