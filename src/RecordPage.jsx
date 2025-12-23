import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecordPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  async function fetchRecords() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/api/records`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setRecords(data || []);
    } catch (e) {
      setError("Failed to load records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Saved Records</h1>
        <div>
          <Link to="/calculate">
            <button className="notSave">Calculate</button>
          </Link>
          <button style={{ marginLeft: 8 }} onClick={fetchRecords}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "#fecaca" }}>{error}</p>
      ) : records.length === 0 ? (
        <p>No saved records yet.</p>
      ) : (
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ textAlign: "left", borderBottom: "1px solid #334155" }}
              >
                <th>#</th>
                <th>Username</th>
                <th>BMI</th>
                <th>Category</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Saved At</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr
                  key={r.id || i}
                  style={{ borderBottom: "1px solid #0b1220" }}
                >
                  <td style={{ padding: "8px 6px" }}>{r.id ?? i + 1}</td>
                  <td style={{ padding: "8px 6px" }}>
                    {r.username ?? r.user?.username ?? "-"}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {r.bmi ?? r.bmiInfo?.bmi}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {r.category ?? r.bmiInfo?.category}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {r.height ?? r.bmiInfo?.height} cm
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {r.weight ?? r.bmiInfo?.weight} kg
                  </td>
                  <td
                    style={{
                      padding: "8px 6px",
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    {r.savedAt ? new Date(r.savedAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecordPage;
