import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FirmDetails from "./pages/FirmDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/firm/:id" element={<FirmDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
