import React from "react";
import "./form1.css";

function form2(props) {
  return (
    <div className="sign-up-container max-1600">
      <input
        type="text"
        placeholder="School"
        value={props.inputs.school}
        onChange={(e) => props.setInputs("school", e.target.value)}
      />
      <input
        type="text"
        placeholder="Graduation Year"
        value={props.inputs.grad_year}
        onChange={(e) => props.setInputs("grad_year", e.target.value)}
      />
      <input
        type="text"
        placeholder="Major"
        value={props.inputs.major}
        onChange={(e) => props.setInputs("major", e.target.value)}
      />
      <input
        type="text"
        placeholder="GPA"
        value={props.inputs.gpa}
        onChange={(e) => props.setInputs("gpa", e.target.value)}
      />
    </div>
  );
}

export default form2;
