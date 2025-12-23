import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const apiBase = "http://localhost:5000";

function Registration({ defaultUsername = "", onCancel, onSave }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(defaultUsername || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get the redirect location from state or search params, default to /record
  const from = location.state?.from?.pathname || new URLSearchParams(location.search).get("from") || "/record";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${apiBase}/api/signup`,
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
        // If onSave is provided (modal use case), call it
        if (onSave) {
          onSave({ username, password });
        } else {
          // Route use case - navigate back to the previous page or default to /record
          navigate(from, { replace: true });
        }
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data?.error || "Username already exists");
        } else {
          setError(err.response.data?.error || "Registration failed");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2>Register to Save Result</h2>
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
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
          
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <span style={{ color: "#666" }}>Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/login", { 
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
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
