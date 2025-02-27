const express = require("express");const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateCaptcha, generateCaptchaImage } = require("../utils/captchaUtility");
const { sendEmail } = require("../utils/emailUtility");
const crypto = require("crypto");

// generates jwt token. valid for 15 minutes
const generateToken = (userId) => {
    return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// captcha generation
exports.getCaptcha = (req, res) => {
    const captchaText = generateCaptcha();
    const captchaImage = generateCaptchaImage(captchaText);

    req.session.captcha = captchaText;

    res.json({ image: captchaImage, captchaKey: captchaText });
};

// user login
exports.loginUser = async (req, res) => {
    try {
        const { email, password, captchaResponse } = req.body;
        console.log("Login request received:", { email, password });

        // validate CAPTCHA
        if (!req.session.captcha || captchaResponse !== req.session.captcha) {
            return res.status(401).json({ error: "❌ Incorrect CAPTCHA" });
        }

        // clear session CAPTCHA after validation for security
        req.session.captcha = null;

        // find user in database
        const sql = "SELECT user_id, user_password FROM users WHERE user_email = ?";
        console.log("Executing database query to find user...");
        const [results] = await db.query(sql, [email]);

        if (results.length === 0) {
            console.log("No user found for email:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        console.log("User found:", user);

        // verify password
        const isMatch = await bcrypt.compare(password, user.user_password);
        console.log("Password match status:", isMatch);
        if (!isMatch) {
            console.log("Incorrect password for email:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // generate authentication token
        const token = generateToken(user.user_id);
        console.log("JWT token generated:", token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });

        console.log("Login successful for user:", email);
        res.json({ message: "✅ Login successful!" });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "❌ Server error during login" });
    }
};

// pet owner signup (step 1)
exports.signupPetOwnerStep1 = async (req, res) => {
    const { fname, lname, email, contact, address, password, confirmPassword} = req.body;

    if (!fname || !lname || !email || !contact || !address || !password || !confirmPassword) {
        return res.status(400).json({ error: "❌ All fields are required!" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "❌ Passwords do not match!" });
    }

    try {
        const [existingUser] = await db.query("SELECT * FROM users WHERE user_email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "❌ Email already in use." });
        }

        // hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // temporarily store in session to allow backtracking
        req.session.petOwnerData = {
            fname, lname, email, contact, address, altcontact1, altperson1, password: hashedPassword
        };

        res.json({ message: "✅ Step 1 completed. Proceed to pet info." });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "❌ Database error." });
    }
};

// signup with pet info (step 2)
exports.signupPetOwnerStep2 = async (req, res) => {
    const { petname, gender, species, breed, birthdate, captchaInput } = req.body;

    // validate CAPTCHA
    if (!req.session.captcha || captchaInput !== req.session.captcha) {
        return res.status(400).json({ error: "❌ Incorrect CAPTCHA!" });
    }
    req.session.captcha = null;  // Clear CAPTCHA after validation

    // validate session data
    if (!req.session.petOwnerData) {
        return res.status(400).json({ error: "❌ Personal info missing. Restart signup process." });
    }

    const { fname, lname, email, contact, address, password, altcontact1, altperson1 } = req.session.petOwnerData;

    try {
        // insert pet owner into users table
        const [userResult] = await db.query(
            "INSERT INTO users (user_email, user_password, user_firstname, user_lastname, user_contact, user_role) VALUES (?, ?, ?, ?, ?, ?)",
            [email, password, fname, lname, contact, "owner"]
        );
        const userId = userResult.insertId;

        // insert address into owner table
        await db.query(
            "INSERT INTO owner (user_id, owner_address, owner_alt_person1, owner_alt_contact1) VALUES (?, ?, ?, ?)",
            [userId, address, altperson1, altcontact1]
        );

        // insert pet details into pet_info table
        await db.query(
            "INSERT INTO pet_info (pet_name, pet_gender, pet_species, pet_breed, pet_birthday, pet_vitality, pet_status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [petname, gender, species, breed, birthdate, true, true, userId]
        );

        // generate authentication token
        const token = generateToken(userId);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000
        });

        // clear session data after successful signup
        req.session.petOwnerData = null;

        res.status(201).json({ message: "✅ Pet Owner account created successfully!" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "❌ Server error during signup." });
    }
};

// employee signup
exports.signupEmployeeRequest = async (req, res) => {
    const { fname, lname, email, role, password, confirmPassword } = req.body;

    if (!fname || !lname || !email || !role || !password || !confirmPassword) {
        return res.status(400).json({ error: "❌ All fields are required!" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "❌ Passwords do not match!" });
    }

    try {
        // Check if email already exists
        const [existingUser] = await db.query("SELECT * FROM users WHERE user_email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "❌ Email already in use." });
        }

        // Generate a unique access code
        const accessCode = crypto.randomBytes(4).toString("hex").toUpperCase(); // Example: "A1B2C3D4"

        // Store temporary data in session
        req.session.employeeData = { fname, lname, email, role, password, accessCode };

        // Send email to clinic owner
        const clinicOwnerEmail = process.env.CLINIC_OWNER_EMAIL;
        const subject = "New Employee Signup Request - PAWtient Tracker";
        const body = `Hello Clinic Owner,\n\nA new employee has requested to sign up:\n\nName: ${fname} ${lname}\nEmail: ${email}\nPosition: ${role}\n\nTo approve, provide them with the following access code:\n\nAccess Code: ${accessCode}\n\nIf this request is unauthorized, please ignore this email.`;

        await sendEmail(clinicOwnerEmail, subject, body);

        res.json({ message: "✅ Signup request sent. Await access code from the clinic owner." });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "❌ Server error." });
    }
};

// employee signup: access code
exports.signupEmployeeComplete = async (req, res) => {
    const { email, accessCode } = req.body;

    if (!email || !accessCode) {
        return res.status(400).json({ error: "❌ Email and access code are required!" });
    }

    try {
        if (!req.session.employeeData || req.session.employeeData.email !== email) {
            return res.status(400).json({ error: "❌ No signup request found. Please start again." });
        }

        const { fname, lname, role, password, accessCode: storedCode } = req.session.employeeData;

        if (accessCode !== storedCode) {
            return res.status(400).json({ error: "❌ Invalid access code." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert employee into the database
        const [userResult] = await db.query(
            "INSERT INTO users (user_email, user_password, user_firstname, user_lastname, user_role) VALUES (?, ?, ?, ?, ?)",
            [email, hashedPassword, fname, lname, role]
        );
        const userId = userResult.insertId;
        
        // Generate authentication token
        const authToken = generateToken(userId);
        res.cookie("token", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000
        });

        // Clear session data
        req.session.employeeData = null;

        res.json({ message: "✅ Signup successful! You can now log in." });
    } catch (error) {
        console.error("Employee Signup Error:", error);
        res.status(500).json({ error: "❌ Server error." });
    }
};

// user logout;
exports.logoutUser = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "✅ Logged out successfully!" });
};
