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
    if (!category) return "#94a3b8";
    
    const normalized = category.toLowerCase().replace(/\s+/g, "");
    const colorMap = {
      underweight: "#3b82f6", // blue
      normalweight: "#22c55e", // green
      overweight: "#eab308", // yellow
      obese: "#ef4444", // red
    };
    return colorMap[normalized] || "#94a3b8";
  };

  const getCategoryBg = (category) => {
    if (!category) return "rgba(148, 163, 184, 0.1)";
    
    const normalized = category.toLowerCase().replace(/\s+/g, "");
    const bgMap = {
      underweight: "rgba(59, 130, 246, 0.1)", // blue background
      normalweight: "rgba(34, 197, 94, 0.1)", // green background
      overweight: "rgba(234, 179, 8, 0.1)", // yellow background
      obese: "rgba(239, 68, 68, 0.1)", // red background
    };
    return bgMap[normalized] || "rgba(148, 163, 184, 0.1)";
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
            ❮
          </button>
          <div className="title-group">
            <h1>Saved Records</h1>
          </div>
        </div>
      </div>
      {records.length > 0 && (
        <div className="records-count-row">
          <span className="records-count">{records.length} {records.length === 1 ? 'record' : 'records'}</span>
        </div>
      )}

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
        <div className="records-list">
          {records.map((r, i) => {
            const category = r.category ?? r.bmiInfo?.category ?? "";
            const categoryColor = getCategoryColor(category);
            const bmi = r.bmi ?? r.bmiInfo?.bmi;
            const height = r.height ?? r.bmiInfo?.height ?? "-";
            const weight = r.weight ?? r.bmiInfo?.weight ?? "-";
            const savedAt = r.savedat
              ? new Date(r.savedat).toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-";

            return (
              <div
                key={r.id || i}
                className="record-card"
                style={{
                  borderLeft: `4px solid ${categoryColor}`,
                }}
              >
                <div className="record-card-content">
                  <div className="record-main-info">
                    <div className="record-bmi-value">{bmi}</div>
                    <span
                      className="category-badge"
                      style={{
                        color: categoryColor,
                        backgroundColor: getCategoryBg(category),
                      }}
                    >
                      {category || "-"}
                    </span>
                  </div>
                  <div className="record-details">
                    <div className="record-detail-item">
                      <span className="record-detail-label">Height:</span>
                      <span className="record-detail-value">{height}cm</span>
                    </div>
                    <div className="record-bottom-row">
                      <div className="record-detail-item">
                        <span className="record-detail-label">Weight:</span>
                        <span className="record-detail-value">{weight}kg</span>
                      </div>
                      <div className="record-date">{savedAt}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecordPage;
