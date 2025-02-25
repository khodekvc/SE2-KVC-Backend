import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import SignupPetOwner from "./components/SignupPetOwner";
import SignupEmployee from "./components/SignupEmployee";
import PetInfo from "./components/PetInfo"; 
import AccessCode from "./components/AccessCode"; 
import Landing from './components/LandingPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup-petowner" element={<SignupPetOwner />} />
          <Route path="/signup-employee" element={<SignupEmployee />} />
          <Route path="/signup-petowner-petinfo" element={<PetInfo />} />
          <Route path="/signup-employee-accesscode" element={<AccessCode />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
