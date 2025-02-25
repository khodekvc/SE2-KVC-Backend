import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPetOwner = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSessionData() {
      const response = await fetch('http://localhost:5000/session-data');
      const data = await response.json();
      if (data.formData) {
        setFormData(data.formData);
      }
    }
    fetchSessionData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, formData }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("✅ Step 1 validated successfully!");
        setStep(2);
      } else {
        setError(data.error || "❌ Step 1 failed.");
      }
    } catch (error) {
      setError("❌ Server error. Please try again later.");
    }
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
        <h2>{step === 1 ? "Create Account - Step 1" : "Create Account - Step 2"}</h2>
        <p>Your pet's care starts here!</p>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={step === 1 ? handleStep1Submit : () => navigate("/pet-info")}>
          {step === 1 && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name*</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name*</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Number*</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address*</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password*</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password*</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="nextbutton">NEXT</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPetOwner;
