import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const apiBase = "http://localhost:5000";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/auth/me`, {
        withCredentials: true,
      });
      if (res.data.authenticated) {
        setIsLoggedIn(true);
        setUsername(res.data.username || "");
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiBase}/api/logout`, {}, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      setUsername("");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still update UI even if logout request fails
      setIsLoggedIn(false);
      setUsername("");
      navigate("/");
    }
  };

  return (
    <div className="container">
      <div className="auth-header">
        {isLoggedIn ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <div className="username-display">
              <span className="username-icon">👤</span>
              <span className="username-text">{username}</span>
            </div>
          </>
        ) : (
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
        )}
      </div>
      <div className="home-content">
        <h1>BMI Calculator</h1>
        <p>Quickly calculate your Body Mass Index and save records.</p>

        <div className="home-buttons">
          <Link to="/calculate">
            <button>Calculate</button>
          </Link>
          <Link to={isLoggedIn ? "/record" : "/login"}>
            <button className="notSave">Record</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
