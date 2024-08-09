import React from "react";
import { useState } from "react";
import axios from "axios";

function Logout() {
  localStorage.removeItem("username");
  window.location.href = "/";

  return <h1>Logging Out</h1>;
}

export default Logout;
