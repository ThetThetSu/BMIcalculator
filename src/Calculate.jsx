import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Calculate = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [userName, setUsername] = useState("");
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
      user: { username: userName },
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h1>
          {" "}
          <span
            type="button"
            aria-label="Back to home"
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
            }}
          >
            ⬅️
          </span>
          BMI Calculator
        </h1>
      </div>

      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        placeholder="Name"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="height">Height (cm)</label>
      <input
        type="number"
        id="height"
        placeholder="e.g. 160"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />

      <label htmlFor="weight">Weight (Kg)</label>
      <input
        type="number"
        id="weight"
        placeholder="e.g. 65"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={calculateBMI}>Calculate</button>

      <div className="result">{resultMsg}</div>
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
