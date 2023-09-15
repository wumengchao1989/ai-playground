import { Avatar } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const AIInstructorWelcome = () => {
  const AvatarList = [
    {
      name: "Michael",
      imgSrc: "/avatar/avatar001.jpg",
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
      name: "Virtual Assistant",
      imgSrc: "/avatar/avatar003.jpg",
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1 style={{ fontSize: 80 }}>Leadership Coach Bot</h1>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {AvatarList.map((item) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Link to="/ai_instructor_inner">
                  <Avatar
                    src={item.imgSrc}
                    size={164}
                    style={{ backgroundColor: item.bgColor }}
                  />
                </Link>
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
