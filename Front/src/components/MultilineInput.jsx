import React, { useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import { Row, Col, Container } from "react-bootstrap";

function MultilineInput() {
  const [textValue, setTextValue] = useState("");
  const [downloadPath, setDownloadPath] = useState("");
  const [loading, setLoading] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleSubmit = () => {
    if (loading) return;
    setLoading(true);
    axios
      .post("https://7c906c947c74.ngrok.app/getresume", {
        username: window.localStorage.getItem("username"),
        job: textValue,
      })
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        setDownloadPath(
          `https://7c906c947c74.ngrok.app/download/${window.localStorage.getItem(
            "username"
          )}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container className="text-center">
      <h1 className="display-2 my-5">Apply</h1>
      <Row>
        <Col>
          <div className="border-2 bg-[#55c1bd] p-2.5 mb-2 text-center w-full box-border text-white font-bold text-lg">
            Enter job description:
          </div>
          <textarea
            value={textValue}
            onChange={handleChange}
            placeholder="Enter your text here"
            style={{
              width: "100%",
              height: "300px",
              padding: "10px",
              boxSizing: "border-box",
              resize: "none",
              outline: "2px solid #55c1bd",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          />

          <div className="d-flex align-items-center justify-content-center">
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 20px",
                border: "1px solid #d0d0d0",
                backgroundColor: "#f0f0f0",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Submit
            </button>
            {loading && (
              <div class="spinner-border m-2" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </Col>
        <Col>
          {downloadPath && (
            <>
              <iframe
                // src={"https://7c906c947c74.ngrok.app/download/tim"}
                src={downloadPath}
                frameborder="0"
                style={{ width: "100%", height: "100%" }}
              ></iframe>
              <a href={downloadPath} target="_blank">
                <button
                  className="mt-3"
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #d0d0d0",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                >
                  Download
                </button>
              </a>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MultilineInput;
