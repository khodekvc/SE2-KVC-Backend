import React from 'react';
import { useState } from "react";

const SignupPetOwner = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing up pet owner:", formData);
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1>KHO<br />VETERINARY<br />CLINIC</h1>
        <div className="alternate-links">
          <a href="/signup-employee">Sign Up as Employee</a>
          <p>Not a Pet Owner?</p>
        </div>
      </div>

      <div className="right-section">
        <h2>Create Account</h2>
        <p>Your pet's care starts here!</p>
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

          <div className="form-row">
            <div className="form-group">
              <label>Email*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Number*</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Address*</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password*</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password*</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="nextbutton">NEXT</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPetOwner;
