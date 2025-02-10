import React from 'react';
import { useState } from "react";
import "../css/PetInfo.css"

const PetInfo = () => {
  return (
        <div className="container">
    
        <div className="left-section">
          <h1>KHO<br /> VETERINARY<br /> CLINIC</h1>
          <div className="alternate-links">
            <a href="signup-employees.jsp">Sign Up as Employee</a><br />
            <p>Not a Pet Owner?</p>
          </div>
        </div>
    
        <div className="right-section">
          <h2>Create Account</h2>
    
          <p>Your pet's care starts here!</p>
          
          <div className="form">
          <form>
    
            <div className = "form-row">
            <div className="form-group">
              <label htmlFor="petname">Pet Name*</label>
              <input type="text" id="petname" name="petname" required />
            </div>
            <div className="radio">
                <label>Gender*</label>
                <div className="radio-group">
                  <input type="radio" id="male" name="gender" value="male" required />
                  <label htmlFor="male">Male</label>
                  <input type="radio" id="female" name="gender" value="female" required />
                  <label htmlFor="female">Female</label>
                </div>
              </div>
            </div>
    
            <div className = "form-row">
            <div className="form-group">
                <label htmlFor="species">Pet Species*</label>
                <input type="text" id="species" name="species" required />
              </div>
            <div className="form-group">
              <label htmlFor="breed">Pet Breed (Optional)</label>
              <input type="text" id="breed" name="breed" />
            </div>
            </div>
    
            <div className="form-group">
              <label htmlFor="birthdate">Birthday (Optional)</label>
              <input type="date" id="birthdate" name="birthdate" />
            </div>
    
            <div className="form-group captcha">
              <label htmlFor="captcha">Enter Captcha</label>
              <div className="captcha-container">
                <img className="generated" src="SignUpPetOwnerServlet" alt="CAPTCHA" id="captchaImage" />
                <input type="text" id="captcha" name="captcha" required />
              </div>
            </div>
    
            <div className = "button-group">
            <button type="button" className="button2" onClick={() => window.history.back()}>BACK</button>
            <button type="submit" className="button3" name="action" value="signup">SIGN UP</button>
            </div>
            
          </form>
        </div>
        </div>
    
        </div>
      );
    };
export default PetInfo;
