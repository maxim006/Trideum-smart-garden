import "./fanComponent.css";
import axios from "axios";
import React, { useState } from "react";

function FanComponent() {
  const startFan = () => {
    axios.get("http://localhost:5000/start/fan").then((res) => {
      setButtonColor("green");
      console.log;
    });

    setTimeout(() => {
      console.log("Turning button black");
      setButtonColor("black");
    }, 10000);
  };
  return (
    <div className="fanComponentWrapper">
      <div className="fantext"> FAN</div>
      <button
        className="startFanButton"
        style={{ backgroundColor: buttonColor }}
        onClick={startFan}
      >
        Start
      </button>
    </div>
  );
}

export default FanComponent;
