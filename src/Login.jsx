import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const apiBase = "http://localhost:5000";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Get the redirect location from state or search params, default to /record
  const from = location.state?.from?.pathname || new URLSearchParams(location.search).get("from") || "/record";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        `${apiBase}/api/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const { userId } = res.data || {};
      if (userId) {
        // Navigate back to the previous page or default to /record
        navigate(from, { replace: true });
      } else {
        setError("Login failed");
      }
    } catch (err) {
      if (err.response && err.response.status === 401)
        setError("Invalid credentials");
      else setError("Login failed");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2>Login to Save Result</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} /> */}

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="form-error">{error}</div>}

          <div className="actions">
            <button
              type="button"
              className="notSave"
              onClick={() => navigate(from || "/", { replace: true })}
            >
              Cancel
            </button>
            <button type="submit">Login</button>
          </div>
          
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <span style={{ color: "#666" }}>Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/registration", { 
                state: { from: location.state?.from || { pathname: from } } 
              })}
              style={{
                background: "none",
                border: "none",
                color: "#3b82f6",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                fontSize: "inherit"
              }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
