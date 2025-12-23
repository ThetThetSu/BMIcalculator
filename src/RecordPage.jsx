import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const apiBase = "http://localhost:5000";

const RecordPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function fetchRecords() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${apiBase}/api/records`, {
        withCredentials: true,
      });
      setRecords(res.data || []);
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        setError("Please log in to view your records");
      } else {
        setError("Failed to load records. Please try again.");
      }
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      Underweight: "#60a5fa",
      "Normal weight": "#34d399",
      Overweight: "#fbbf24",
      Obese: "#f87171",
    };
    return colors[category] || "#94a3b8";
  };

  const getCategoryBg = (category) => {
    const colors = {
      Underweight: "rgba(96, 165, 250, 0.1)",
      "Normal weight": "rgba(52, 211, 153, 0.1)",
      Overweight: "rgba(251, 191, 36, 0.1)",
      Obese: "rgba(248, 113, 113, 0.1)",
    };
    return colors[category] || "rgba(148, 163, 184, 0.1)";
  };

  return (
    <div className="container">
      <div className="records-header">
        <div className="records-title-section">
          <button
            className="back-button"
            onClick={() => navigate("/")}
            aria-label="Back to home"
            title="Back to home"
          >
            ⬅️
          </button>
          <div className="title-group">
            <h1>Saved Records</h1>
            {records.length > 0 && (
              <span className="records-count">{records.length} {records.length === 1 ? 'record' : 'records'}</span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="records-loading">
          <div className="loading-spinner"></div>
          <p>Loading your records...</p>
        </div>
      ) : error ? (
        <div className="records-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          {error.includes("log in") && (
            <Link to="/login">
              <button className="action-btn">Log In</button>
            </Link>
          )}
        </div>
      ) : records.length === 0 ? (
        <div className="records-empty">
          <span className="empty-icon">📋</span>
          <h2>No records yet</h2>
          <p>Start calculating your BMI to save records here.</p>
          <Link to="/calculate">
            <button className="action-btn">Calculate BMI</button>
          </Link>
        </div>
      ) : (
        <div className="records-table-wrapper">
          <table className="records-table">
            <thead>
              <tr>
                <th>#</th>
                <th>BMI</th>
                <th>Category</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Saved At</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id || i}>
                  <td className="record-id">{r.id ?? i + 1}</td>
                  <td className="record-bmi">
                    <strong>{r.bmi ?? r.bmiInfo?.bmi}</strong>
                  </td>
                  <td>
                    <span
                      className="category-badge"
                      style={{
                        color: getCategoryColor(r.category ?? r.bmiInfo?.category),
                        backgroundColor: getCategoryBg(r.category ?? r.bmiInfo?.category),
                      }}
                    >
                      {r.category ?? r.bmiInfo?.category ?? "-"}
                    </span>
                  </td>
                  <td>{r.height ?? r.bmiInfo?.height ?? "-"} cm</td>
                  <td>{r.weight ?? r.bmiInfo?.weight ?? "-"} kg</td>
                  <td className="record-date">
                    {r.savedat
                      ? new Date(r.savedat).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
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
