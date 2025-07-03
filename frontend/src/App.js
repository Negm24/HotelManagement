import React, {useEffect, useState} from "react";
// import GuestsList from "./components/GuestsList";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from "./components/SignUp";
import EmployeeAcc from "./components/EmployeeAcc";
import GuestAcc from "./components/GuestAcc";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path='/employee' element={<EmployeeAcc />} />
        <Route path="/guest" element={<GuestAcc />} />
      </Routes>
    </Router>
  );
}

export default App;
