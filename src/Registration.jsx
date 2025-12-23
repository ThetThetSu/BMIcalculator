import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiBase = "http://localhost:5000";

function Registration({ defaultUsername = "", onCancel, onSave }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(defaultUsername || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          // Route use case - navigate after successful signup
          navigate("/record");
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
        </form>
      </div>
    </div>
  );
}

export default Registration;
