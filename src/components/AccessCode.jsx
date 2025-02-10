import React from 'react';
import { useState } from "react";
import "../css/AccessCode.css"

const AccessCode = () => {
  return (
    <div className="container">
      <div className="left-section">
        <h1>KHO<br /> VETERINARY<br /> CLINIC</h1>
        <div className="alternate-links">
          <a href="signup-petowners.jsp">Sign Up as Pet Owner</a><br />
          <p>Not an Employee?</p>
        </div>
      </div>

      <div className="right-section">
        <h2>Access Code <br />
        Confirmation</h2>

        <div className="form">
          <form action="#" method="POST">
            <div className="form-group">
              <label for="fname">Please enter the access code sent to your email by the doctor to confirm your role.</label>
              <input type="number" id="accesscode" name="accesscode" required />
            </div>
            <button type="submit" className="button2">SUBMIT</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccessCode;
