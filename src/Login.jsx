import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiBase = "http://localhost:5000";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
        navigate("/record");
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
          <h2>
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
            Login to Save Result
          </h2>
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
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
