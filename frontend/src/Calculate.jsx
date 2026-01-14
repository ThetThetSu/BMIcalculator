import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Calculate = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const navigate = useNavigate();

  const calculateBMI = () => {
    if (!height || !weight) {
      setResultMsg("Please enter both height and weight!");
      return;
    }

    const heightInMeters = height / 100;
    const bmi = parseFloat(
      (weight / (heightInMeters * heightInMeters)).toFixed(1)
    );

    let category =
      bmi < 18.5
        ? "Underweight"
        : bmi < 25
        ? "Normal weight"
        : bmi < 30
        ? "Overweight"
        : "Obese";

    const bmiInfo = {
      bmi,
      category,
      height,
      weight,
    };
    try {
      sessionStorage.setItem("bmi_info", JSON.stringify(bmiInfo));
    } catch (e) {
      // ignore
    }
    navigate("/result");
  };

  return (
    <div className="container">
      <div className="records-header">
        <div className="records-title-section">
          <button
            className="back-button"
            onClick={() => navigate("/")}
            aria-label="Back to home"
            title="Back to home"
          >
            ❮
          </button>
          <div className="title-group">
            <h1>BMI Calculator</h1>
          </div>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "16px",
        marginTop: "32px"
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <label htmlFor="height">Height (cm)</label>
          <input
            type="number"
            id="height"
            placeholder="e.g. 160"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div style={{ width: "100%", maxWidth: "400px" }}>
          <label htmlFor="weight">Weight (Kg)</label>
          <input
            type="number"
            id="weight"
            placeholder="e.g. 65"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <button onClick={calculateBMI}>Calculate</button>

        {resultMsg && <div className="result">{resultMsg}</div>}
      </div>
    </div>
  );
};

export default Calculate;
// import { useState } from "react";
// import Result from "./Result";
// import Home from "./Home";

// const Calculate = () => {
//   const [showHome, setShowHome] = useState(true);
//   const [seeResult, setSeeResult] = useState(false);
//   const [height, setHeight] = useState("");
//   const [weight, setWeight] = useState("");
//   const [userName, setUsername] = useState("");
//   const [bmiInfo, setBmiInfo] = useState(null);
//   const [result, setResult] = useState("");

//   const calculateBMI = () => {
//     if (!height || !weight) {
//       setResult("Please enter both height and weight!");
//       return;
//     }

//     const heightInMeters = height / 100;
//     const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

//     let category =
//       bmi < 18.5
//         ? "Underweight"
//         : bmi < 25
//         ? "Normal weight"
//         : bmi < 30
//         ? "Overweight"
//         : "Obese";

//     setBmiInfo({ bmi, category, height, weight, user: { username: userName } });
//     setSeeResult(true);
//   };

//   const handleRecord = () => {
//     // Placeholder for record page
//     alert("Record page not implemented yet.");
//   };

//   return (
//     <>
//       {showHome ? (
//         <Home onCalculate={() => setShowHome(false)} onRecord={handleRecord} />
//       ) : seeResult ? (
//         <Result setSeeResult={setSeeResult} bmiInfo={bmiInfo} />
//       ) : (
//         <div className="container">
//           {/* <button style={{ float: "left" }} onClick={() => setShowHome(true)}>
//             Home
//           </button> */}
//           <h1>
//             <span
//               style={{ float: "left", cursor: "pointer" }}
//               onClick={() => setShowHome(true)}
//             >
//               ⬅️
//             </span>
//             BMI Calculator
//           </h1>
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             id="username"
//             placeholder="Name"
//             value={userName}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <label htmlFor="height">Height (cm)</label>
//           <input
//             type="number"
//             id="height"
//             placeholder="e.g. 160"
//             value={height}
//             onChange={(e) => setHeight(e.target.value)}
//           />

//           <label htmlFor="weight">Weight (Kg)</label>
//           <input
//             type="number"
//             id="weight"
//             placeholder="e.g. 65"
//             value={weight}
//             onChange={(e) => setWeight(e.target.value)}
//           />

//           <button onClick={calculateBMI}>Calculate</button>

//           <div className="result">{result}</div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Calculate;
