import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import Category from "./Category";
import Registration from "./Registration";

const apiBase = "http://localhost:5000";

ChartJS.register(ArcElement, Tooltip, Legend);

function Result({ bmiInfo: propBmiInfo }) {
  const [showRegister, setShowRegister] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [bmiInfo, setBmiInfo] = useState(propBmiInfo || null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasCheckedPendingSaveRef = useRef(false);

  useEffect(() => {
    if (!bmiInfo) {
      try {
        const stored = sessionStorage.getItem("bmi_info");
        if (stored) setBmiInfo(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
  }, [bmiInfo]);

  // Check if there's a pending save after login/registration
  // This runs whenever the component mounts or location changes (user navigates back)
  useEffect(() => {
    const checkPendingSave = async () => {
      if (!bmiInfo || hasCheckedPendingSaveRef.current || isSaving) return;
      
      try {
        const pendingSave = sessionStorage.getItem("pending_bmi_save");
        if (pendingSave) {
          // Check if user is now authenticated
          const authRes = await axios.get(`${apiBase}/api/auth/me`, {
            withCredentials: true,
          });

          if (authRes.data.authenticated) {
            // User is logged in/registered, save the pending record
            hasCheckedPendingSaveRef.current = true; // Set before saving to prevent duplicate checks
            const pendingData = JSON.parse(pendingSave);
            setIsSaving(true);
            await saveRecordToBackend(pendingData);
            // Clear the pending save flag
            sessionStorage.removeItem("pending_bmi_save");
            setIsSaving(false);
          }
        }
      } catch (error) {
        console.error("Error checking pending save:", error);
        hasCheckedPendingSaveRef.current = false; // Reset on error to allow retry
      }
    };

    // Check pending save when component mounts or when user navigates back to result page
    if (location.pathname === "/result") {
      checkPendingSave();
    } else {
      // Reset ref when navigating away to allow re-checking when coming back
      hasCheckedPendingSaveRef.current = false;
    }
  }, [bmiInfo, location, isSaving]);

  const { bmi, category, height, weight } = bmiInfo || {};

  const colors = {
    Underweight: { first: "blue", second: "black" },
    "Normal weight": { first: "green", second: "black" },
    Overweight: { first: "yellow", second: "black" },
    Obese: { first: "orange", second: "black" },
  };

  const color = colors[category] ?? { first: "red", second: "black" };

  // const weight = 3;
  // function handleColor() {
  //   if (weight <= 3) {
  //     setColor({ ...color, first: "red", second: "blue" });
  //   }
  // }

  function handleBack() {
    navigate("/calculate");
  }

  async function handleSaveClick() {
    if (!bmiInfo || !bmi || !category || !height || !weight) {
      setSavedMessage("Missing BMI information");
      setTimeout(() => setSavedMessage(""), 2500);
      return;
    }

    setIsSaving(true);
    setSavedMessage("");

    try {
      // Check if user is authenticated
      const authRes = await axios.get(`${apiBase}/api/auth/me`, {
        withCredentials: true,
      });

      if (authRes.data.authenticated) {
        // User is logged in, save to backend
        await saveRecordToBackend();
      } else {
        // User is not logged in, store BMI data for later save and navigate to login
        sessionStorage.setItem("pending_bmi_save", JSON.stringify({
          height: parseFloat(height),
          weight: parseFloat(weight),
          bmi: parseFloat(bmi),
          category: category,
        }));
        navigate("/login", { 
          state: { from: { pathname: "/result" } } 
        });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      // If auth check fails, navigate to login with current location for redirect
      navigate("/login", { 
        state: { from: { pathname: "/result" } } 
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function saveRecordToBackend(data = null) {
    try {
      // Use provided data or current bmiInfo
      const recordData = data || {
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(bmi),
        category: category,
      };

      const response = await axios.post(
        `${apiBase}/api/records`,
        recordData,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        setSavedMessage("Saved successfully");
        setTimeout(() => setSavedMessage(""), 2500);
      }
    } catch (error) {
      console.error("Error saving record:", error);
      if (error.response?.status === 401) {
        setSavedMessage("Please log in to save records");
        // Store data for later save
        const recordData = data || {
          height: parseFloat(height),
          weight: parseFloat(weight),
          bmi: parseFloat(bmi),
          category: category,
        };
        sessionStorage.setItem("pending_bmi_save", JSON.stringify(recordData));
        navigate("/login", { 
          state: { from: { pathname: "/result" } } 
        });
      } else {
        setSavedMessage("Failed to save record");
      }
      setTimeout(() => setSavedMessage(""), 2500);
    }
  }

  function handleRegisterSave(user) {
    try {
      const list = JSON.parse(
        localStorage.getItem("bmi_registrations") || "[]"
      );
      const record = {
        user,
        bmiInfo: { bmi, category, height, weight },
        savedAt: new Date().toISOString(),
      };
      list.push(record);
      localStorage.setItem("bmi_registrations", JSON.stringify(list));
      setSavedMessage("Saved successfully");
    } catch (e) {
      setSavedMessage("Failed to save");
    }
    setShowRegister(false);
    setTimeout(() => setSavedMessage(""), 2500);
  }

  const numBmi = parseFloat(bmi) || 0;
  const data = {
    labels: [],
    datasets: [
      {
        data: [numBmi, Math.max(0, 30 - numBmi)],
        backgroundColor: [color.first, color.second],
        borderColor: [color.first, color.second],
      },
    ],
  };

  // const options = {};
  return (
    <div>
      <div className={showRegister ? "backdrop blurred" : "backdrop"}>
        <div className="container">
          <h1>BMI Calculator</h1>
          <div
            style={{
              width: "100px",
              height: "100px",
              margin: "5px auto",
              display: "flex",
            }}
          >
            <Doughnut
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "68%",
                radius: "100%",
                layout: { padding: 0 },
                plugins: { lengend: { display: false } },
              }}
              style={{ margin: "auto" }}
            ></Doughnut>
          </div>
          <p style={{ fontSize: "15px" }}>
            Your BMI is {bmi}. You are {category}.
          </p>

          <div className="resultInput">
            <div className="heightInput">
              <label htmlFor="height">Height: </label>
              <input id="height" value={`${height ?? ""}cm`} readOnly />
            </div>

            {/* Weight */}
            <div className="weightInput">
              <label htmlFor="weight">Weight: </label>
              <input id="weight" value={`${weight ?? ""}kg`} readOnly />
            </div>
          </div>

          <Category />
          <div className="saveBtn">
            <button onClick={handleBack} className="notSave">
              Back to Calculate
            </button>
            <button onClick={handleSaveClick} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Result"}
            </button>
          </div>
        </div>
      </div>
      {showRegister && (
        <Registration
          defaultUsername={bmiInfo?.user?.username}
          onCancel={() => setShowRegister(false)}
          onSave={handleRegisterSave}
        />
      )}
      {savedMessage && (
        <div style={{ textAlign: "center" }}>{savedMessage}</div>
      )}
    </div>
  );
}

export default Result;
