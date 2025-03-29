// server/controllers/authController.js
const UserModel = require('../../models/userModel'); // Adjust path if needed
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Assume generateToken is defined correctly elsewhere or within this file
const generateToken = (userId, userRole) => {
    const payload = { userId, userRole };
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '15m' }); // Ensure secret exists
};


exports.loginUser = async (req, res) => {
    console.log('\n[Controller Debug] --- loginUser START ---'); // Mark start
    try {
        const { email, password, captchaInput } = req.body;
        console.log(`[Controller Debug] Received - Email: ${email}, Password: ${password ? '***' : 'N/A'}, Captcha: ${captchaInput}`); // Log inputs (mask password)

        // 1. CAPTCHA Check
        console.log(`[Controller Debug] Checking CAPTCHA. Session: ${req.session?.captcha}, Input: ${captchaInput}`);
        if (!req.session || !req.session.captcha || captchaInput !== req.session.captcha) {
            console.log('[Controller Debug] CAPTCHA Check Failed');
            return res.status(401).json({ error: "❌ Incorrect CAPTCHA" });
        }
        req.session.captcha = null;
        console.log('[Controller Debug] CAPTCHA Check Passed, cleared session captcha');

        // 2. Find User
        console.log(`[Controller Debug] Finding user for email: ${email}`);
        const user = await UserModel.findByEmail(email);
        // Be careful logging user object if it contains sensitive data beyond password hash
        console.log('[Controller Debug] User found:', user ? {id: user.user_id, role: user.user_role, hasPassword: !!user.user_password} : null);

        // 3. Validate User and Password
        console.log('[Controller Debug] Entering password check block...');
        let passwordMatch = false; // Variable to store compare result

        if (user && user.user_password) { // Check user and password hash exist
             console.log(`[Controller Debug] User exists with password hash. Attempting bcrypt.compare...`);
             try {
                 // --- THE CRITICAL LINE ---
                 passwordMatch = await bcrypt.compare(password, user.user_password);
                 // --- END CRITICAL LINE ---
                 console.log(`[Controller Debug] bcrypt.compare finished. Result: ${passwordMatch}`);
             } catch (compareError) {
                 console.error('[Controller Debug] Error DURING bcrypt.compare:', compareError);
                 // Re-throw the error so it's caught by the main try/catch
                 throw compareError;
             }
        } else {
            console.log(`[Controller Debug] Skipping bcrypt.compare. User found: ${!!user}, User password hash exists: ${!!user?.user_password}`);
        }

        // Evaluate condition based on results
        if (!user || !passwordMatch) {
             console.log(`[Controller Debug] Login check FAILED. User exists: ${!!user}, Password matched: ${passwordMatch}`);
            return res.status(401).json({ error: "Invalid email or password" });
        }
        console.log('[Controller Debug] Password check PASSED.');

        // 4. Generate Token
        console.log(`[Controller Debug] Generating token for user ID: ${user.user_id}, role: ${user.user_role}`);
        const token = generateToken(user.user_id, user.user_role);
        console.log("[Controller Debug] Token generated.");

        // 5. Set Cookie
        console.log("[Controller Debug] Setting cookie...");
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });
        console.log("[Controller Debug] Cookie set.");

        // 6. Send Success Response
        console.log("[Controller Debug] Sending success response.");
        res.json({
            message: "✅ Login successful!",
            redirectUrl: "/patients",
        });
        console.log('[Controller Debug] --- loginUser END (Success) ---');

    } catch (error) {
        // Log the error caught by the main try/catch
        console.error("[Controller Debug] CAUGHT ERROR in loginUser:", error);
        // Keep original log for consistency if needed
        // console.error("Login Error:", error);
        res.status(500).json({ error: "❌ Server error during login" });
        console.log('[Controller Debug] --- loginUser END (Error) ---');
    }
};