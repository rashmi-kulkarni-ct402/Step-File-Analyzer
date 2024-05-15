import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Viewer from "./components/FileAnalyser";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/viewer" element={<Viewer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
