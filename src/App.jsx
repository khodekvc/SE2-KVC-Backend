import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import LoginForm from "./pages/LoginForm";
import SignupPetOwner from "./pages/SignupPetOwner";
import SignupEmployee from "./pages/SignupEmployee";
import PetInfo from "./pages/PetInfo"; 
import AccessCode from "./pages/AccessCode"; 
import Landingg from './pages/Landing';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
        <Route path="/" element={<Landingg/>} />
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
