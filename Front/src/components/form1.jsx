import React from "react";
import "./form1.css";

function form1(props) {
  return (
    <div className="sign-up-container max-1600">
      <input
        type="text"
        placeholder="First Name"
        value={props.inputs.first}
        onChange={(e) => props.setInputs("first", e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={props.inputs.last}
        onChange={(e) => props.setInputs("last", e.target.value)}
      />
      <input
        type="text"
        placeholder="Address"
        value={props.inputs.address}
        onChange={(e) => props.setInputs("address", e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={props.inputs.phone}
        onChange={(e) => props.setInputs("phone", e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={props.inputs.email}
        onChange={(e) => props.setInputs("email", e.target.value)}
      />
    </div>
  );
}

export default form1;
