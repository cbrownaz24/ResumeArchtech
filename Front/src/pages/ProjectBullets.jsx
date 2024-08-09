import React, { useState, useEffect } from "react";
import axios from "axios";
import { Accordion, Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import "../components/ProjectBullets.css";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProjectBullets() {
  let [projects, setProjects] = useState([]);

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

  const saveBullets = () => {
    axios
      .post("https://7c906c947c74.ngrok.app/updateprojects", {
        username: window.localStorage.getItem("username"),
        repos: projects,
      })
      .then((res) => {
        setProjects(res.data.repos);
        console.log(res.data.repos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Container className="py-1 my-2 text-center">
        <h1 className="display-2">Projects</h1>
        <Button className="my-3" onClick={saveBullets}>
          Save Bullets
        </Button>
        <Accordion defaultActiveKey={0}>
          {Object.values(projects).map((project, index) => {
            return (
              <Accordion.Item eventKey={index}>
                <Accordion.Header>{project.name}</Accordion.Header>
                <Accordion.Body>
                  {(project.bullets ?? []).map((bullet, bullet_index) => {
                    return (
                      <>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            setProjects((prevProjects) => {
                              prevProjects[project.name].bullets[bullet_index] =
                                e.target.value;
                              return { ...prevProjects };
                            });
                          }}
                          className="w-100 border border-primary rounded p-1 my-1 "
                        />
                        <br />
                      </>
                    );
                  })}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Container>
    </>
  );
}
