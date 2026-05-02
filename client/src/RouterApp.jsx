import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./App";

export default function RouterApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
