import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [fizzbuzz, setFizzbuzz] = useState();
  const [fizzbuzzOutput, setFizzbuzzOutput] = useState("");

  const handleSubmit = () => {
    // axios
    //   .post("http://localhost:5000/fizzbuzz", { fizzbuzz: fizzbuzz })
    //   .then((response) => {
    //     setFizzbuzzOutput(response.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    axios.get("http://localhost:5000/fizzbuzz").then((res) => {
      setFizzbuzzOutput(res.data);
    });
  };

  return (
    <div className="App">
      <div className="App-header">
        <input
          type="number"
          name="num"
          value={fizzbuzz}
          onChange={(e) => {
            setFizzbuzz(e.target.value);
          }}
        ></input>
        <button onClick={handleSubmit}>Submit</button>
        <div>{fizzbuzzOutput.temperature}</div>
      </div>
    </div>
  );
}
export default App;
