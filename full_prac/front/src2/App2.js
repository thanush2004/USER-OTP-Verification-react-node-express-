import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import HomePage from "./HomePage";
import Signup from "./Signup";
import Fop from "./Fop";
import Enterotp from "./Enterotp";
import Changepass from "./changepassword";

function App2() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/fop" element={<Fop />} />
        <Route path="/enterotp" element={<Enterotp />} />
        <Route path="/changepass" element={<Changepass />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App2;
