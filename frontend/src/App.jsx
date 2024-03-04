import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [fizzbuzz, setFizzbuzz] = useState();
  const [fizzbuzzOutput, setFizzbuzzOutput] = useState("");

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/fizzbuzz", { fizzbuzz: fizzbuzz })
      .then((response) => {
        setFizzbuzzOutput(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log(fizzbuzzOutput);
  }, [fizzbuzzOutput]);

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
        <div>{fizzbuzzOutput.FizzBuzz}</div>
      </div>
    </div>
  );
}
export default App;
