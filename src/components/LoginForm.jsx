import React from 'react';
import { useState } from "react";
import "../css/LoginForm.css"

const LoginForm = () => {
  return (
    <div className="container">

    <div className="left-section">
      <h1>KHO<br /> VETERINARY<br /> CLINIC</h1>
    </div>

    <div className="right-section">
      <h2>Welcome Back!</h2>
      <p>Login to your account</p>

      <form>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input type="password" id="password" name="password" required />
        </div>

        <div className="forgot">
          <a href="#">Forgot Password?</a>
        </div>

        <div className="form-group captcha">
          <label htmlFor="captcha">Enter Captcha</label>
          <div className="captcha-container">
              <img className="generated" src="LoginServlet" alt="CAPTCHA" id="captchaImage" />
            <input type="text" id="captcha" name="captcha" required />
          </div>
        </div>
        
        <button type="submit" className="button2">LOGIN</button>
      </form>
    </div>
  </div>
  );
};

export default LoginForm;
