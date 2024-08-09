import React from "react";
import { useState } from "react";
import axios from "axios";
import NavBar from "../components/Navbar.jsx";

function Login() {
  let [username, setUsername] = useState("");

  const signup = () => {
    axios
      .post("https://7c906c947c74.ngrok.app/checkusername", {
        username: username,
      })
      .then((res) => {
        if (res.data.exists) {
          alert("Username already exists");
        } else {
          localStorage.setItem("username", username);
          window.location.href = "/personal-info";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = () => {
    axios
      .post("https://7c906c947c74.ngrok.app/checkusername", {
        username: username,
      })
      .then((res) => {
        if (res.data.exists) {
          localStorage.setItem("username", username);
          window.location.href = "/apply";
        } else {
          alert("Username does not exist");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <NavBar />
      <div className="sign-up-container w-full">
        <div className="header text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide lg:mt-40">
          Login
        </div>
        <input
          type="text"
          placeholder="Input Unique Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="footer">
          <button onClick={signup}>Create Account</button>
          <button onClick={login}>Login</button>
        </div>
      </div>
    </>
  );
}

export default Login;
