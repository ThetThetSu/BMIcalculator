import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Result from "./Result";
import Calculate from "./Calculate";
import RecordPage from "./RecordPage";
import { useState } from "react";
import Registration from "./Registration";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calculate" element={<Calculate />} />
      <Route path="/result" element={<Result />} />
      <Route path="/record" element={<RecordPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
    </Routes>
  );
}

export default App;
