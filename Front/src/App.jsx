import React from "react";
import { Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage.jsx";
import Landing from "./pages/Landing.jsx";
import PersonalInfo from "./pages/PersonalInfo.jsx";
import FinalizeResume from "./pages/FinalizeResume.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Bullets from "./pages/Bullets.jsx";
import Apply from "./pages/Apply.jsx";

export default function App() {
  let authenticated = localStorage.getItem("username") ? true : false;
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/personal-info"
          element={
            <PR>
              <PersonalInfo />
            </PR>
          }
        />
        <Route
          path="/bullets"
          element={
            <PR>
              <Bullets />
            </PR>
          }
        />
        <Route path="/finalize-resume" element={<FinalizeResume />} />
        <Route
          path="apply"
          element={
            <PR>
              <Apply />
            </PR>
          }
        />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </div>
  );
}

function PR(props) {
  if (localStorage.getItem("username")) {
    return props.children;
  } else {
    window.location.href = "/";
    return null;
  }
}
