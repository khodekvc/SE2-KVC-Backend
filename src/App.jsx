"use client"

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import OwnerSidebar from "./components/OwnerSidebar";
import PatientDirectory from "./pages/PatientDirectory";
import PetProfile from "./pages/PetProfile";
import MyAccount from "./pages/MyAccount";
import AddNewPet from "./pages/AddNewPet";
import LoginForm from "./pages/LoginForm";
import SignupPetOwner from "./pages/SignupPetOwner";
import SignupEmployee from "./pages/SignupEmployee";
import PetInfo from "./pages/PetInfo"; 
import AccessCode from "./pages/AccessCode"; 
import Landing from "./pages/Landing";
import { ConfirmDialogProvider } from "./contexts/ConfirmDialogContext";
import { DiagnosisLockProvider } from "./contexts/DiagnosisLockContext";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isOwner] = useState(false); // Set true for pet owners

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleMenuItemClick = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <ConfirmDialogProvider>
      <DiagnosisLockProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup-petowner" element={<SignupPetOwner />} />
            <Route path="/signup-employee" element={<SignupEmployee />} />
            <Route path="/signup-petowner-petinfo" element={<PetInfo />} />
            <Route path="/signup-employee-accesscode" element={<AccessCode />} />
            <Route
              path="/*"
              element={
                <>
                  <Header toggleSidebar={toggleSidebar} />
                  <div className="app-container">
                    <div className="main-content">
                      {isOwner ? (
                        <OwnerSidebar className={isSidebarVisible ? "visible" : ""} />
                      ) : (
                        <Sidebar className={isSidebarVisible ? "visible" : ""} onMenuItemClick={handleMenuItemClick} />
                      )}
                      <Routes>
                        <Route path="/patients" element={<PatientDirectory />} />
                        <Route path="/PetProfile/:id" element={<PetProfile />} />
                        <Route path="/account" element={<MyAccount />} />
                        <Route path="/add-pet" element={<AddNewPet />} />
                      </Routes>
                    </div>
                  </div>
                </>
              }
            />
          </Routes>
        </Router>
      </DiagnosisLockProvider>
    </ConfirmDialogProvider>
  );
}

export default App;
