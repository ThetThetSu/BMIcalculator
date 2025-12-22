import React from "react";

const Home = ({ onCalculate, onRecord }) => {
  return (
    <div className="container">
      <h1>BMI Calculator</h1>
      <p>Quickly calculate your Body Mass Index and save records.</p>

      <div className="home-buttons">
        <button onClick={onCalculate}>Calculate</button>
        <button className="notSave" onClick={onRecord}>
          Record
        </button>
      </div>
    </div>
  );
};

export default Home;
