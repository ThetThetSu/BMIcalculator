import { useState } from "react";
import Result from "./Result";

const App = () => {
  const [seeResult, setSeeResult] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [userName, setUsername] = useState("");
  const [bmiInfo, setBmiInfo] = useState(null);
  const [result, setResult] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) {
      setResult("Please enter both height and weight!");
      return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    let category =
      bmi < 18.5
        ? "Underweight"
        : bmi < 25
        ? "Normal weight"
        : bmi < 30
        ? "Overweight"
        : "Obese";

    // if (bmi < 18.5) category = "Underweight";
    // else if (bmi < 25) category = "Normal Weight";
    // else if (bmi < 30) category = "Overweight";
    // else category = "Obese";

    // setResult(`${userName}.Your BMI is ${bmi} : You are ${category}`);
    setBmiInfo({ bmi, category, height, weight });
    setSeeResult(true);
  };

  return (
    <>
      {seeResult ? (
        <Result setSeeResult={setSeeResult} bmiInfo={bmiInfo} />
      ) : (
        <div className="container">
          {/* Heading  */}
          <h1>BMI Calculator</h1>
          {/* Username */}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* Height */}
          <label htmlFor="height">Height (cm)</label>
          <input
            type="number"
            id="height"
            placeholder="e.g. 160"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />

          {/* Weight */}
          <label htmlFor="weight">Weight (Kg)</label>
          <input
            type="number"
            id="weight"
            placeholder="e.g. 65"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          {/* Btn */}
          <button onClick={calculateBMI}>Calculate</button>

          {/* Result */}
          <div className="result">{result}</div>
        </div>
      )}
    </>
  );
};

export default App;
