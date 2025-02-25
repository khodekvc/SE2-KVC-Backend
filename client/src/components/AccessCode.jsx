import React from 'react';
import { useState } from "react";

const AccessCode = () => {
  const[accessCode, setAccessCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Access Code Submitted:", accessCode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Please enter the access code sent to your email:</label>
      <input type="number" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} required />

      <button type="submit" className="button2">SUBMIT</button>
    </form>
  );
};

export default AccessCode;
