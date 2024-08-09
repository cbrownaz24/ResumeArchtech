import React from "react";
import logo from "../assets/logo.png";
import { navItems } from "../constants";
import { useState, useEffect } from "react";

const Navbar = () => {
  let [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(window.localStorage.getItem("username") !== null);
  }, []);

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 w-full">
      <div className="container px-4 mx-auto relative text-lg">
        <div className="flex justify-between items-center">
          {/* Logo and Title Container */}
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="logo" />
            <a href="/" className="py-2 px-1 border-slate-400 rounded-md">
              Resume Architech
            </a>
          </div>
          {/* Account Button on the far right */}
          <div>
            {!loggedIn && (
              <a href="login" className="py-2 px-3 border-slate-400 rounded-md">
                Login
              </a>
            )}
            {loggedIn && (
              <>
                <a
                  href="personal-info"
                  className="py-2 px-3 border-slate-400 rounded-md"
                >
                  Profile
                </a>
                <a
                  href="bullets"
                  className="py-2 px-3 border-slate-400 rounded-md"
                >
                  Bullet Points
                </a>
                <a
                  href="apply"
                  className="py-2 px-3 border-slate-400 rounded-md"
                >
                  Apply
                </a>
                <a
                  href="logout"
                  className="py-2 px-3 border-slate-400 rounded-md"
                >
                  Logout
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
