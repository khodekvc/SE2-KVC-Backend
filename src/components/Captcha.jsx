 const Captcha = ({ captcha, setCaptcha }) => {
    return (
      <div className="form-group captcha">
        <label htmlFor="captcha">Enter Captcha</label>
        <div className="captcha-container">
          <img className="generated" src="LoginServlet" alt="CAPTCHA" id="captchaImage" />
          <input
            type="text"
            id="captcha"
            name="captcha"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            required
          />
        </div>
      </div>
    );
  };
  
  export default Captcha;
  