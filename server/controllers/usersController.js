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

        try {
            // Fetch current profile data
            const currentProfile = await UserModel.getUserById(userId);

            // Update only the fields that are provided
            const updatedProfile = {
                firstname: firstname || currentProfile.user_firstname,
                lastname: lastname || currentProfile.user_lastname,
                email: email || currentProfile.user_email,
                contact: contact || currentProfile.user_contact
            };

            await UserModel.updateEmployeeProfile(userId, updatedProfile.firstname, updatedProfile.lastname, updatedProfile.email, updatedProfile.contact);

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
        const { firstname, lastname, email, contact, address, altperson1, altcontact1, altperson2, altcontact2 } = req.body;
        const userId = req.user.userId;

        console.log("Request Body:", req.body);
        console.log("User ID from JWT:", userId);

        // Validate that if altperson2 is provided, altcontact2 must also be provided
        if ((altperson2 && !altcontact2) || (!altperson2 && altcontact2)) {
            return res.status(400).json({ error: "❌ If altPerson2 or altContact2 is provided, both must be provided." });
        }

        try {
            // Fetch current profile data
            const currentProfile = await UserModel.getUserById(userId);
            const currentOwnerProfile = await UserModel.getOwnerByUserId(userId);

            // Update only the fields that are provided
            const updatedProfile = {
                firstname: firstname || currentProfile.user_firstname,
                lastname: lastname || currentProfile.user_lastname,
                email: email || currentProfile.user_email,
                contact: contact || currentProfile.user_contact,
                address: address || currentOwnerProfile.owner_address,
                altperson1: altperson1 || currentOwnerProfile.owner_alt_person1,
                altcontact1: altcontact1 || currentOwnerProfile.owner_alt_contact1,
                altperson2: altperson2 || currentOwnerProfile.owner_alt_person2,
                altcontact2: altcontact2 || currentOwnerProfile.owner_alt_contact2
            };

            await UserModel.updateOwnerProfile(userId, updatedProfile.firstname, updatedProfile.lastname, updatedProfile.email, updatedProfile.contact, updatedProfile.address, updatedProfile.altperson1, updatedProfile.altcontact1, updatedProfile.altperson2, updatedProfile.altcontact2);

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