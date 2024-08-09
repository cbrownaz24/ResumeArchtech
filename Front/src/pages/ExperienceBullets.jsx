import React, { useState, useEffect } from "react";
import axios from "axios";
import { Accordion, Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import "../components/ProjectBullets.css";

export default function ExperienceBullets() {
  let [experiences, setExperiences] = useState({});

  useEffect(() => {
    axios
      .get("https://7c906c947c74.ngrok.app/getuser", {
        params: {
          username: window.localStorage.getItem("username"),
        },
      })
      .then((res) => {
        setExperiences(res.data.experiences ?? {});
        console.log(res.data.experiences);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const saveBullets = () => {
    axios
      .post("https://7c906c947c74.ngrok.app/updateexperiences", {
        username: window.localStorage.getItem("username"),
        experiences: experiences,
      })
      .then((res) => {
        setExperiences(res.data.experiences);
        console.log(res.data.experiences);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Container className="py-1 my-2 text-center">
        <h1 className="display-2">Experiences</h1>
        <Button className="my-3" onClick={saveBullets}>
          Save Bullets
        </Button>
        <Accordion defaultActiveKey={0}>
          {Object.values(experiences).map((experience, index) => {
            return (
              <Accordion.Item eventKey={index}>
                <Accordion.Header>{experience.name}</Accordion.Header>
                <Accordion.Body>
                  {(experience.bullets ?? []).map((bullet, bullet_index) => {
                    return (
                      <>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            setExperiences((prevExperiences) => {
                              prevExperiences[experience.name].bullets[
                                bullet_index
                              ] = e.target.value;
                              return { ...prevExperiences };
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
