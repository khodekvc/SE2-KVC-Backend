import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
<<<<<<< HEAD:src/pages/LoginForm.jsx
=======
import { useState } from "react";
>>>>>>> parent of 2229f39 (connected backend and frontend ver 1000000):client/src/pages/LoginForm.jsx
import { Button } from '../components/Button';
import FormGroup from '../components/FormGroup';
import "../css/Forms.css"


function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: "",
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD:src/pages/LoginForm.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted");

  try {
    const csrfToken = document.cookie
      .split("; ")
      .find(row => row.startsWith("csrfToken="))
      ?.split("=")[1];
    console.log(csrfToken);

    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");

    setMessage(data.message);
    window.location.replace(data.redirectUrl);
  } catch (error) {
    setMessage(error.message);
  }
};

=======
>>>>>>> parent of 2229f39 (connected backend and frontend ver 1000000):client/src/pages/LoginForm.jsx
  return (
    <>
    <Navbar />
    <div className="login-container">
      <div className="left-section">
        <h1 className='login-h1'>KHO<br /> VETERINARY<br /> CLINIC</h1>
      </div>
      <div className="right-section">
        <h2>Welcome Back!</h2>
        <p>Login to your account</p>
        <form>
          <FormGroup 
            label="Email" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <FormGroup 
            label="Password" 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <div className="forgot">
            <a href="#">Forgot Password?</a>
          </div>
          <div className="forms-group captcha">
            <label htmlFor="captcha">Enter Captcha</label>
            <div className="captcha-container">
              <img className="generated" alt="CAPTCHA" />
              <input 
                type="text" 
                id="captcha" 
                name="captcha" 
                value={formData.captcha} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
<<<<<<< HEAD:src/pages/LoginForm.jsx
          <Button buttonStyle='btn--primary' type="submit" className="form-btn-1">LOGIN</Button>
=======
          <Button buttonStyle='btn--primary' to='/patients' className="form-btn-1">LOGIN</Button>
>>>>>>> parent of 2229f39 (connected backend and frontend ver 1000000):client/src/pages/LoginForm.jsx
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginForm;
