import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registration({ defaultUsername = "", onCancel, onSave }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(defaultUsername || "");
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }
    // Basic email check
    // if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    //   setError("Please enter a valid email");
    //   return;
    // }

    onSave({ username, password });
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
            Register to Save Result
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
            <button type="button" className="notSave" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
