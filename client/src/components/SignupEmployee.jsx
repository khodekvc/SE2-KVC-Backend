import React, { useState, useEffect } from "react";
import Captcha from "./Captcha";

const SignupEmployee = () => {
  const [formData, setFormData] = useState({
  firstname: "",  // Change from fname to firstname
  lastname: "",   // Change from lname to lastname
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

        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name*</label>
            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name*</label>
            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contact Number*</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
          </div>
          <div className="radio">
            <label>Choose Role*</label>
            <div className="radio-group">
              <input type="radio" id="clinician" name="role" value="clinician" onChange={handleChange} required />
              <label htmlFor="clinician">Clinician</label>
              <input type="radio" id="staff" name="role" value="staff" onChange={handleChange} required />
              <label htmlFor="staff">Front Desk Staff</label>
            </div>
          </div>
          <div className="form-group">
            <label>Password*</label>
            <div className="password-container">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password*</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <Captcha
            captcha={formData.captchaInput}
            setCaptcha={(value) => setFormData({ ...formData, captchaInput: value })}
            captchaImage={captchaImage}
            fetchCaptcha={fetchCaptcha}
          />
          <button type="submit" className="button2" disabled={loading}>
            {loading ? "Signing Up..." : "SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupEmployee;