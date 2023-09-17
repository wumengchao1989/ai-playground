import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ChatBoxLayout from "./components/chatbox/ChatBoxLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import CoachDataManagerLayout from "./components/dashboardanalysis/CoachDataManagerLayout";
import ArchDesignLayout from "./components/archdesign/ArchdesignLayout";
import AutoUpgradeLayout from "./components/autoupgrade/AutoUpgradeLayout";
import AiInstructor from "./components/aiinstructor/aiInstructor";
import Demo from "./components/demo";
import AIInstructorWelcome from "./components/aiinstructor/aiInstructorWelcome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <ChatBoxLayout />,
      },
      {
        path: "/autoupgrade",
        element: <AutoUpgradeLayout />,
      },
      {
        path: "/chatbox/:chatid?",
        element: <ChatBoxLayout />,
      },
      {
        path: "/coach_data_management",
        element: <CoachDataManagerLayout />,
      },
      {
        path: "archdesign",
        element: <ArchDesignLayout />,
      },
      {
        path: "ai_instructor",
        element: <AIInstructorWelcome />,
      },
      {
        path: "ai_instructor_inner",
        element: <AiInstructor />,
      },
      {
        path: "demo",
        element: <Demo />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
