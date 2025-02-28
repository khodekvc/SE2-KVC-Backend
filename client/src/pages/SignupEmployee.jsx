import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import { Button } from '../components/Button';
import FormGroup from '../components/FormGroup';
import "../css/Forms.css";

const SignupEmployee = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    role: "",
    password: "",
    confirmPassword: "",
    captchaInput: "",
  });

  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/captcha", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();

        console.log("Fetched CAPTCHA Data:", data);

        setCaptchaImage(data.image);
        setCaptchaKey(data.captchaText);

      } else {
        console.error("Failed to load CAPTCHA");
      }
    } catch (error) {
      console.error("Error fetching CAPTCHA:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signing up employee:", formData);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/auth/signup/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          captchaKey,
          captchaResponse: formData.captchaInput,
        }),
      });
      const data = await response.json();

      console.log("Signup Response:", data);

      if (response.ok) {
        alert("Employee signup successful!");
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "❌ Signup failed. Please try again.");
        fetchCaptcha();
      }
    } catch (error) {
      setError("❌ Server error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <>
    <Navbar />
    <div className="signup-container">
      <div className="left-section">
        <h1>KHO<br /> VETERINARY<br /> CLINIC</h1>
        <div className="alternate-links">
          <Button buttonStyle='btn--primary' to='/signup-petowner' className="form-btn-2">Sign up as Pet Owner</Button>
          <p>Not an Employee?</p>
        </div>
      </div>
      <div className="right-section">
        <h2>Create Account</h2>
          <p>Become part of our team!</p>
          
          {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="signup-form-row">
            <FormGroup 
              label="First Name" 
              type="text" 
              name="fname" 
              value={formData.firstname} 
              onChange={handleChange} 
              required 
            />
            <FormGroup 
              label="Last Name" 
              type="text" 
              name="lname" 
              value={formData.lastname} 
              onChange={handleChange} 
              required 
            />
          </div>
          <FormGroup 
            label="Email" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <div className="radio">
            <label>Choose Role*</label>
            <div className="radio-group">
              <input 
                type="radio" 
                id="clinicians" 
                name="role" 
                value="clinician" 
                onChange={handleChange} 
                required 
              />
              <label htmlFor="clinicians">Clinician</label>
              <input 
                type="radio" 
                id="staff" 
                name="role" 
                value="staff" 
                onChange={handleChange} 
                required 
              />
              <label htmlFor="staff">Front Desk Staff</label>
            </div>
          </div>
          <FormGroup 
            label="Password" 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <FormGroup 
            label="Confirm Password" 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
          />
          <div className="forms-group captcha">
            <label htmlFor="captcha">Enter Captcha</label>
            <div className="captcha-container">
              <img className="generated" src="LoginServlet" alt="CAPTCHA" id="captchaImage" />
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
          <Button buttonStyle='btn--primary' to='/signup-employee-accesscode' className="form-btn-1">SIGN UP</Button>
        </form>
      </div>
    </div>
  </>
  );
};

export default SignupEmployee;
