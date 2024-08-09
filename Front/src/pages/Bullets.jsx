import React from "react";
import ProjectBullets from "./ProjectBullets";
import ExperienceBullets from "./ExperienceBullets";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar";

export default function Bullets() {


  return (
    <>
    <NavBar />
    <div className="flex flex-col w-full justify-center items-center h-screen">
        <div className="grid grid-cols-2 w-full">
            <div>
                <ProjectBullets />
            </div>
            <div>
                <ExperienceBullets />
            </div>
        </div>
        <a href='/apply' className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-50 rounded">Apply to a Job</a>
    </div>
    <Footer />
    </>
  );
}
