import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Result from "./Result";
import Calculate from "./Calculate";
import RecordPage from "./RecordPage";
import { useState } from "react";
import Registration from "./Registration";

function App() {
  const [user, setUser] = useState(null);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calculate" element={<Calculate />} />
      <Route path="/result" element={<Result />} />
      <Route path="/record" element={<RecordPage user={user} />} />
      <Route
        path="/registration"
        element={<Registration setUser={setUser} />}
      />
    </Routes>
  );
}

export default App;
