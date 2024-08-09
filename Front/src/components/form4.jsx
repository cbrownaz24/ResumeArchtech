import React, { useState, useEffect } from "react";
import axios from "axios";
import "./form1.css";

export default function form4(props) {
  let [projects, setProjects] = useState([]);
  let [ghLoading, setGhLoading] = useState(false);
  let [projectName, setProjectName] = useState("");
  let [projectDescription, setProjectDescription] = useState("");

  useEffect(() => {
    axios
      .get("https://7c906c947c74.ngrok.app/getuser", {
        params: {
          username: window.localStorage.getItem("username"),
        },
      })
      .then((res) => {
        setProjects(res.data.repos ?? {});
        console.log(res.data.repos);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addProject = () => {
    let newProject = {
      name: projectName,
      readme: projectDescription,
      selected: true,
    };

    axios
      .post("https://7c906c947c74.ngrok.app/updateprojects", {
        username: window.localStorage.getItem("username"),
        repos: { ...projects, [projectName]: newProject },
      })
      .then((res) => {
        console.log(res.data);
        setProjects(res.data.repos);
        setProjectName("");
        setProjectDescription("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // delteProject function
  const deleteProject = (project) => {
    let newProjects = { ...projects };
    delete newProjects[project];
    axios
      .post("https://7c906c947c74.ngrok.app/updateprojects", {
        username: window.localStorage.getItem("username"),
        repos: newProjects,
      })
      .then((res) => {
        console.log(res.data);
        setProjects(res.data.repos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const scrapeGithub = () => {
    setGhLoading(true);
    axios
      .post("https://7c906c947c74.ngrok.app/scrapegithub", {
        username: window.localStorage.getItem("username"),
        github: props.inputs.github,
      })
      .then((res) => {
        setGhLoading(false);
        console.log(res.data);
        setProjects(res.data.repos);
        setProjectName("");
        setProjectDescription("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-screen">
      <div className="grid grid-cols-2 gap-4 p-8">
        <div className="flex flex-col p-8">
          <h1 className="text-3xl font-bold pb-4">Input GitHub Username</h1>
          <input
            className="border-2 rounded-md p-2 mb-4"
            type="text"
            placeholder="GitHub Username"
            value={props.inputs.github}
            onChange={(e) => props.setInputs("github", e.target.value)}
          />
          <div className="flex flex-row">
            <button
              className="w-1/2 p-2 border-2 rounded-md mb-8 mr-4 text-white bg-black"
              onClick={scrapeGithub} // NEED TO CHANGE THIS TO A DIFF FUNCTION
            >
              {" "}
              Scrape GitHub
            </button>
            {ghLoading && (
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold pb-4">Add Additional Projects</h1>
          <input
            className="border-2 rounded-md p-2 mb-4"
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <textarea
            className="h-64 border-2 rounded-md p-2 mb-4"
            placeholder="Project Description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
          <button
            className="w-1/2 p-2 border-2 rounded-md mb-8"
            onClick={addProject}
          >
            Add
          </button>
        </div>
        <div className="flex justify-top items-top bg-gradient-to-r from-blue-100 to-green-200 rounded-xl border-4 border-slate-500">
          <div className="flex justify-top w-full">
            <ul className="w-full p-8">
              <h1 className="text-3xl font-bold pb-4">Current Projects</h1>
              {Object.values(projects).map((project, index) => (
                <li className="flex justify-between w-full border-2 bg-white rounded-md p-2 m-2 border-slate-500">
                  <span>
                    {index + 1}: {project.name}
                  </span>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      deleteProject(project.name);
                    }}
                  >
                    Delete
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// function form3(props) {
//   return (
//     <div className="sign-up-container">
//       <input
//         type="text"
//         placeholder="GitHub Username"
//         value={props.inputs.github}
//         onChange={(e) => props.setInputs("github", e.target.value)}
//       />
//     </div>
//   );
// }
