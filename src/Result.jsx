import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import Category from "./Category";

ChartJS.register(ArcElement, Tooltip, Legend);

function Result({ bmiInfo, setSeeResult }) {
  const { bmi, category, height, weight } = bmiInfo || {};
  const colors = {
    Underweight: { first: "blue", second: "black" },
    "Normal weight": { first: "green", second: "black" },
    Overweight: { first: "yellow", second: "black" },
    Obese: { first: "orange", second: "black" },
  };

  const color = colors[category] ?? { first: "red", second: "black" };

  // const weight = 3;
  // function handleColor() {
  //   if (weight <= 3) {
  //     setColor({ ...color, first: "red", second: "blue" });
  //   }
  // }

  function handleBack() {
    setSeeResult(false);
  }

  const data = {
    labels: [],
    datasets: [
      {
        // label: "Poll",
        data: [bmi, 30 - bmi],
        backgroundColor: [`${color.first}`, `${color.second}`],
        borderColor: [`${color.first}`, `${color.second}`],
      },
    ],
  };

  // const options = {};
  return (
    <div>
      <div className="container">
        <h1>BMI Calculator</h1>
        <div
          style={{
            width: "100px",
            height: "100px",
            margin: "5px auto",
            display: "flex",
          }}
        >
          <Doughnut
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "68%",
              radius: "100%",
              layout: { padding: 0 },
              plugins: { lengend: { display: false } },
            }}
            style={{ margin: "auto" }}
          ></Doughnut>
        </div>
        <p style={{ fontSize: "15px" }}>
          Your BMI is {bmi}. You are {category}.
        </p>

        <div className="resultInput">
          <div className="heightInput">
            <label htmlFor="height">Height: </label>
            <input id="height" value={`${height ?? ""}cm`} readOnly />
          </div>

          {/* Weight */}
          <div className="weightInput">
            <label htmlFor="weight">Weight: </label>
            <input id="weight" value={`${weight ?? ""}kg`} readOnly />
          </div>
        </div>

        <Category />
        <button onClick={handleBack}>Back to Calculate</button>
      </div>
      <div className="saveBtn">
        <button onClick={handleBack} className="notSave">
          Don't save
        </button>
        <button onClick={handleBack}>Save Result</button>
      </div>
    </div>
  );
}

export default Result;
