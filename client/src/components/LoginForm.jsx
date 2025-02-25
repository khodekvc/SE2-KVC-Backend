import React, { useState, useEffect } from "react";
import Captcha from "./Captcha"; // Import the Captcha component

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaKey, setCaptchaKey] = useState(""); // 🔹 Store captchaKey
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Check if the user is already logged in
  useEffect(() => {
    checkAuthStatus();
    fetchCaptcha(); // ✅ Fetch CAPTCHA on mount
  }, []);



  const checkAuthStatus = async () => {
    try {
        const response = await fetch("http://localhost:5000/auth/status", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            console.error("Failed to fetch auth status");
            return;
        }

        const data = await response.json();

        console.log("Auth Status:", data); // ✅ Debugging: See what response looks like

        if (data.authenticated) {
            window.location.href = "/dashboard"; // ✅ Redirect only if authenticated
        }
    } catch (error) {
        console.error("Auth status check failed:", error);
    }
  };

  // 🔹 Function to fetch CAPTCHA from backend
  const fetchCaptcha = async () => {
    try {
      console.log("Fetching CAPTCHA...");

      const response = await fetch("http://localhost:5000/auth/captcha", {
        method: "GET",
        credentials: "include",
      });

      console.log("CAPTCHA Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("CAPTCHA Data:", data);

        setCaptchaImage(data.captchaImage); // ✅ Correct key from backend
        setCaptchaKey(data.captchaText);// ✅ Store captchaKey for verification

        console.log("CAPTCHA Image Set:", data.captchaImage);
        console.log("CAPTCHA Key Set:", data.captchaText); // ✅ Ensure correct key
      } else {
        console.error("Failed to load CAPTCHA");
      }
    } catch (error) {
      console.error("Error fetching CAPTCHA:", error);
    }
  };

  // 🔹 Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(""); // ✅ Clear previous errors

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Captcha Key:", captchaKey);
    console.log("Captcha Response:", captcha);

    try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
                email, 
                password, 
                captchaKey,  // ✅ Send captchaKey for verification
                captchaResponse: captcha, // ✅ Rename for clarity
            }),
        });

        const data = await response.json();
        console.log("Login response:", data); // ✅ Debugging

        if (response.ok && data.user) { // ✅ Ensure successful login
            window.location.href = "/dashboard"; // ✅ Redirect only on success
        } else {
            setError(data.error || "❌ Login failed. Please try again.");
            fetchCaptcha(); // ✅ Refresh CAPTCHA on failure
        }
    } catch (error) {
        setError("❌ Server error. Please try again later.");
    }

    setLoading(false);
  };


  return (
    <div className="container">
      <div className="left-section">
        <h1>KHO<br /> VETERINARY<br /> CLINIC</h1>
      </div>

      <div className="right-section">
        <h2>Welcome Back!</h2>
        <p>Login to your account</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <Captcha
            captcha={captcha}
            setCaptcha={setCaptcha}
            captchaImage={captchaImage}
            fetchCaptcha={fetchCaptcha}
          />

          <button type="submit" className="button2" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
