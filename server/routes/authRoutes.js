const express = require("express");
const { generateCaptcha, generateCaptchaImage } = require("../utils/captchaUtility");
const authController = require("../controllers/authController");
const db = require("../config/db");
const bcrypt = require('bcrypt');

console.log("DB module:", db);

// create router instance
const router = express.Router();
const captchaStore = new Map();

// Postman test: generate captcha
router.get("/captcha", (req, res) => {
    try {
        const captchaText = generateCaptcha();
        req.session.captcha = captchaText;

        const captchaImage = `${generateCaptchaImage(captchaText)}`;
        console.log(`Generated CAPTCHA: ${captchaText}`);

        res.json({ captchaImage, captchaText });
    } catch (error) {
        console.error("Error generating CAPTCHA:", error);
        res.status(500).json({ error: "Failed to generate CAPTCHA" });
    }
});


// Postman test: verify captcha
router.post("/captcha/verify", (req, res) => {
    const { captchaResponse } = req.body;

    if (!captchaResponse) {
        return res.status(400).json({ error: "Missing CAPTCHA response." });
    }

    if (!req.session.captcha) {
        return res.status(400).json({ error: "Session expired. Please refresh CAPTCHA." });
    }

    if (captchaResponse !== req.session.captcha) {
        return res.status(400).json({ error: "❌ Incorrect CAPTCHA!" });
    }

    delete req.session.captcha;
    res.json({ message: "✅ CAPTCHA verified!" });
});

// Postman test: pet owner & employee login
router.post("/login", async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    
    console.log("Received login request with:", { email, password });

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const [users] = await db.execute("SELECT * FROM users WHERE user_email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(password, user.user_password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.session.user = {
            id: user.user_id,
            email: user.user_email,
            role: user.user_role,
            firstName: user.user_firstname,
            lastName: user.user_lastname
        };

        res.json({ message: "Login successful", user: req.session.user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Routes for user signup and logout (delegated to authController)
router.post("/signup/employee", authController.signupEmployee);
router.post("/logout", authController.logoutUser);

module.exports = router;