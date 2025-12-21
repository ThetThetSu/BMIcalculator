import React, { useState } from "react";

function Registration({ defaultUsername = "", onCancel, onSave }) {
  const [username, setUsername] = useState(defaultUsername || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    // Basic email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    onSave({ username, email, password });
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Register to Save Result</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

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
