const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { authenticate } = require("../middleware/authMiddleware");
const { hashPassword, comparePassword } = require("../utils/passwordUtility");

// Update employee profile
exports.updateEmployeeProfile = [
    authenticate,
    async (req, res) => {
        const { firstname, lastname, email, contact } = req.body;
        const userId = req.user.userId;

        console.log("Request Body:", req.body);
        console.log("User ID from JWT:", userId);

        if (!firstname || !lastname || !email) {
            return res.status(400).json({ error: "❌ All fields are required!" });
        }

        try {
            // Update user profile
            await UserModel.updateEmployeeProfile(userId, firstname, lastname, email, contact);

            res.json({ message: "✅ Employee profile updated successfully!" });
        } catch (error) {
            console.error("Profile Update Error:", error);
            res.status(500).json({ error: "❌ Server error while updating profile." });
        }
    }
];

// Update pet owner profile
exports.updateOwnerProfile = [
    authenticate,
    async (req, res) => {
        const { firstname, lastname, email, contact, address, altperson, altcontact } = req.body;
        const userId = req.user.userId;

        console.log("Request Body:", req.body);
        console.log("User ID from JWT:", userId);

        if (!firstname || !lastname || !email) {
            return res.status(400).json({ error: "❌ All fields are required!" });
        }

        try {
            await UserModel.updateOwnerProfile(userId, firstname, lastname, email, contact, address, altperson, altcontact);

            res.json({ message: "✅ Pet owner profile updated successfully!" });
        } catch (error) {
            console.error("Profile Update Error:", error);
            res.status(500).json({ error: "❌ Server error while updating profile." });
        }
    }
];

exports.changePassword = [
    authenticate,
    async (req, res) => {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ error: "❌ Unauthorized. Please log in." });
        }

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ error: "❌ All fields are required!" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: "❌ New passwords do not match!" });
        }

        try {
            // Fetch the user's current hashed password
            const storedPassword = await UserModel.getPasswordById(userId);

            if (!storedPassword) {
                return res.status(404).json({ error: "❌ User not found." });
            }

            // Compare the current password with the stored password
            const isMatch = await comparePassword(currentPassword, storedPassword);

            if (!isMatch) {
                return res.status(401).json({ error: "❌ Incorrect current password." });
            }

            // Hash the new password
            const hashedPassword = await hashPassword(newPassword);

            // Update the password in the database
            await UserModel.updatePassword(userId, hashedPassword);

            res.json({ message: "✅ Password changed successfully!" });
        } catch (error) {
            console.error("Password Change Error:", error);
            res.status(500).json({ error: "❌ Server error while changing password." });
        }
    }
];