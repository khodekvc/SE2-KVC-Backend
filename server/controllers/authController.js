const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateCaptcha, generateCaptchaImage } = require("../utils/captchaUtility");

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
    const { fname, lname, email, contact, address, password, confirmPassword, altperson1, altcontact1 } = req.body;

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
exports.signupEmployee = async (req, res) => {
    console.log("Received employee signup request:", req.body);

    const { firstname, lastname, email, contact, role, password, confirmPassword, captchaInput, captchaStored } = req.body;

    // validate the input fields
    if (!firstname || !lastname || !email || !role || !contact || !password || !confirmPassword || !captchaInput) {
        return res.status(400).json({ error: "❌ All fields are required!" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "❌ Passwords do not match!" });
    }

    if (captchaInput !== req.session.captcha) {
        return res.status(400).json({ error: "❌ Incorrect CAPTCHA!" });
    }


    // check if the email already exists in the db
    try {
        const [existingUser] = await db.query("SELECT * FROM users WHERE user_email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "❌ Email already in use." });
        }
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "❌ Database error." });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert the employee into the db
    try {
        const [userResult] = await db.query(
            "INSERT INTO users (user_email, user_password, user_firstname, user_lastname, user_contact, user_role) VALUES (?, ?, ?, ?, ?, ?)",
            [email, hashedPassword, firstname, lastname, contact, role]
        );
        const userId = userResult.insertId;

        // generate authentication token
        const token = generateToken(userId);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000
        });

        res.status(201).json({ message: "✅ Employee account created successfully!" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "❌ Server error during employee signup." });
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "✅ Logged out successfully!" });
};
