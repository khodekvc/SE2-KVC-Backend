const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const UserModel = require("../models/userModel");
const PetModel = require("../models/petModel");
const { generateCaptcha, generateCaptchaImage } = require("../utils/captchaUtility");
const { hashPassword } = require("../utils/passwordUtility");
const { generateToken } = require("../utils/authUtility");
const { sendEmail } = require("../utils/emailUtility");

exports.getCaptcha = (req, res) => {
    const captchaText = generateCaptcha();
    const captchaImage = generateCaptchaImage(captchaText);

    req.session.captcha = captchaText;
    res.json({ image: captchaImage, captchaKey: captchaText });
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password, captchaInput } = req.body;

        if (!req.session.captcha || captchaInput !== req.session.captcha) {
            return res.status(401).json({ error: "❌ Incorrect CAPTCHA" });
        }
        req.session.captcha = null;

        const user = await UserModel.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.user_password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user.user_id, user.user_role);
        const csrfToken = crypto.randomBytes(32).toString("hex");

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("csrfToken", csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });

        res.json({
            message: "✅ Login successful!",
            csrfToken,
            redirectUrl: "/patients",
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "❌ Server error during login" });
    }
};

exports.signupPetOwnerStep1 = async (req, res) => {
    const { fname, lname, email, contact, address, password, confirmPassword } = req.body;

    if (!fname || !lname || !email || !contact || !address || !password || !confirmPassword) {
        return res.status(400).json({ error: "❌ All fields are required!" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "❌ Passwords do not match!" });
    }

    try {
        if (await UserModel.isEmailTaken(email)) {
            return res.status(400).json({ error: "❌ Email already in use." });
        }

        req.session.petOwnerData = {
            fname, lname, email, contact, address, password: await hashPassword(password)
        };

        res.json({ message: "✅ Step 1 completed. Proceed to pet info." });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "❌ Server error during signup." });
    }
};

exports.signupPetOwnerStep2 = async (req, res) => {
<<<<<<< Updated upstream
=======
    // ✅ Log the full request body
    console.log("📩 Request Body:", req.body);

    // ✅ Log session data
    console.log("🗂️ Session Data:", req.session);

>>>>>>> Stashed changes
    const { petname, gender, species, breed, birthdate, captchaInput } = req.body;

    if (!req.session.captcha || captchaInput !== req.session.captcha) {
        return res.status(400).json({ error: "❌ Incorrect CAPTCHA!" });
    }
    req.session.captcha = null;

    if (!req.session.petOwnerData) {
<<<<<<< Updated upstream
=======
        console.log("❌ Missing session petOwnerData! User may have skipped Step 1 or session expired.");
>>>>>>> Stashed changes
        return res.status(400).json({ error: "❌ Personal info missing. Restart signup process." });
    }

    const { fname, lname, email, contact, address, password } = req.session.petOwnerData;

    try {
        const userId = await UserModel.createPetOwner({ fname, lname, email, contact, address, password });
<<<<<<< Updated upstream
        await PetModel.createPet({ petname, gender, species, breed, birthdate, userId });

=======
        const petBirthday = birthdate ? birthdate : null;

        await PetModel.createPet({ petname, gender, species, breed, birthdate: petBirthday, userId });
>>>>>>> Stashed changes
        const token = generateToken(userId, "owner");
        console.log('Generated Token:', token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });

        req.session.petOwnerData = null;
<<<<<<< Updated upstream
        res.status(201).json({ message: "✅ Pet Owner account created successfully!" });
=======
        res.status(201).json({
            message: "✅ Pet Owner account created successfully!",
            redirectUrl: "/patients"
        });
>>>>>>> Stashed changes
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "❌ Server error during signup." });
    }
};

// employee signup
exports.signupEmployeeRequest = async (req, res) => {
    const { fname, lname, email, role, password, confirmPassword, captchaInput } = req.body;

    if (!req.session.captcha || captchaInput !== req.session.captcha) {
        return res.status(400).json({ error: "❌ Incorrect CAPTCHA!" });
    }
    req.session.captcha = null;

    if (!fname || !lname || !email || !role || !password || !confirmPassword) {
        return res.status(400).json({ error: "❌ All fields are required!" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "❌ Passwords do not match!" });
    }

    try {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "❌ Email already in use." });
        }

        // Generate access code
        const accessCode = crypto.randomBytes(4).toString("hex").toUpperCase();

        // Store employee signup data in session
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

// Complete Employee Signup
exports.signupEmployeeComplete = async (req, res) => {
    const { accessCode } = req.body;

    if (!accessCode) {
        return res.status(400).json({ error: "❌ Access code is required!" });
    }

    try {
        if (!req.session.employeeData) {
            return res.status(400).json({ error: "❌ No signup request found. Please start again." });
        }

        const { fname, lname, role, password, accessCode: storedCode, email } = req.session.employeeData;

        if (accessCode !== storedCode) {
            return res.status(400).json({ error: "❌ Invalid access code." });
        }

        const hashedPassword = await hashPassword(password);
        const userId = await UserModel.createEmployee({ fname, lname, email, role, hashedPassword });

        const token = generateToken(userId, role);
        console.log('Generated Token:', token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });

        req.session.employeeData = null;

        res.json({ message: "✅ Signup successful! You can now log in." });
    } catch (error) {
        console.error("Employee Signup Error:", error);
        res.status(500).json({ error: "❌ Server error." });
    }
};

// user logout
exports.logoutUser = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
            return res.status(500).json({ message: "Logout failed" });
            }

            // Remove session cookie from browser
            res.clearCookie("connect.sid", { path: "/" });
            return res.json({ message: "Logout successful" });
        })
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ error: "❌ Server error during logout" });
    }
};



