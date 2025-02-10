import React from 'react';
import { useState } from "react";
import "../css/SignupEmployee.css"

const SignupEmployee = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    contact: "",
    role: "",
    password: "",
    confirmPassword: "",
    captcha: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing up employee:", formData);
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1>KHO<br />VETERINARY<br />CLINIC</h1>
        <div className="alternate-links">
          <a href="/signup-petowner">Sign Up as Pet Owner</a>
          <p>Not an Employee?</p>
        </div>
      </div>

      <div className="right-section">
        <h2>Create Account</h2>
        <p>Become part of our team!</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name*</label>
              <input type="text" name="fname" value={formData.fname} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name*</label>
              <input type="text" name="lname" value={formData.lname} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="radio">
            <label>Choose Role*</label>
            <div className="radio-group">
              <input type="radio" id="clinicians" name="role" value="clinician" onChange={handleChange} required />
              <label htmlFor="clinicians">Clinician</label>
              <input type="radio" id="staff" name="role" value="staff" onChange={handleChange} required />
              <label htmlFor="staff">Front Desk Staff</label>
            </div>
          </div>

          <div className="form-group">
            <label>Password*</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password*</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <div className="form-group captcha">
          <label htmlFor="captcha">Enter Captcha</label>
          <div className="captcha-container">
              <img className="generated" src="LoginServlet" alt="CAPTCHA" id="captchaImage" />
            <input type="text" id="captcha" name="captcha" required />
          </div>
        </div>

          <button type="submit" className="button2">SIGN UP</button>
        </form>
      </div>
    </div>
  );
};

export default SignupEmployee;
