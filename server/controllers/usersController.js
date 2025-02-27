const db = require("../config/db");
const bcrypt = require("bcrypt");

// Update user profile (firstname, lastname, email, contact)
exports.updateProfile = async (req, res) => {
    const { firstname, lastname, email, contact } = req.body;
    const userId = req.session.user?.id; // Get user ID from session

    if (!userId) {
        return res.status(401).json({ error: "❌ Unauthorized. Please log in." });
    }

    try {
        // Check if the email is already taken by another user
        const [existingUser] = await db.execute(
            "SELECT user_id FROM users WHERE user_email = ? AND user_id != ?",
            [email, userId]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "❌ Email already in use by another account." });
        }

        // Update user details
        await db.execute(
            "UPDATE users SET user_firstname = ?, user_lastname = ?, user_email = ?, user_contact = ? WHERE user_id = ?",
            [firstname, lastname, email, contact, userId]
        );

        res.json({ message: "✅ Profile updated successfully!" });

    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ error: "❌ Server error while updating profile." });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.session.user?.id; // Get user ID from session

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
        const [user] = await db.execute("SELECT user_password FROM users WHERE user_id = ?", [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: "❌ User not found." });
        }

        // Compare the current password with the hashed password in the database
        const isMatch = await bcrypt.compare(currentPassword, user[0].user_password);

        if (!isMatch) {
            return res.status(401).json({ error: "❌ Incorrect current password." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await db.execute("UPDATE users SET user_password = ? WHERE user_id = ?", [hashedPassword, userId]);

        res.json({ message: "✅ Password changed successfully!" });

    } catch (error) {
        console.error("Password Change Error:", error);
        res.status(500).json({ error: "❌ Server error while changing password." });
    }
};
