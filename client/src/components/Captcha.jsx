import React, { useState } from "react";

const Captcha = ({ captcha, setCaptcha, captchaImage, fetchCaptcha }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔹 Handle CAPTCHA refresh with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCaptcha();
    setIsRefreshing(false);
  };

  return (
    <div className="form-group captcha">
      <label htmlFor="captcha">Enter CAPTCHA *</label>
      <div className="captcha-container">
        {captchaImage ? (
          <img
            className="generated"
            src={captchaImage.startsWith("data:image") ? captchaImage : `data:image/png;base64,${captchaImage}`}
            alt="CAPTCHA verification"
            id="captchaImage"
          />
        ) : (
          <p>Loading CAPTCHA...</p> // ✅ Fallback text while loading
        )}

        <input
          type="text"
          id="captcha"
          name="captcha"
          value={captcha}
          onChange={(e) => setCaptcha(e.target.value)}
          required
          placeholder="Type CAPTCHA here"
        />

        <button
          type="button"
          onClick={handleRefresh}
          className="refresh-captcha"
          disabled={isRefreshing}
        >
          {isRefreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
    </div>
  );
};

export default Captcha;
