import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <h1>BMI Calculator</h1>
      <p>Quickly calculate your Body Mass Index and save records.</p>

      <div className="home-buttons">
        <Link to="/calculate">
          <button>Calculate</button>
        </Link>
        <Link to="/record">
          <button className="notSave">Record</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
