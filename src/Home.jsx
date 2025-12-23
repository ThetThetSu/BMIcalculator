import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="auth-buttons">
        <button 
          className="notSave" 
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
        <button 
          className="auth-btn signup-btn" 
          onClick={() => navigate("/registration")}
        >
          Sign up
        </button>
      </div>
      <h1>BMI Calculator</h1>
      <p>Quickly calculate your Body Mass Index and save records.</p>

      <div className="home-buttons">
        <Link to="/calculate">
          <button>Calculate</button>
        </Link>
        <Link to="/login">
          <button className="notSave">Record</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
