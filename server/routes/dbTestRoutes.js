const express = require("express");
const db = require("../config/db");

const router = express.Router();
// all tests should reflect on the db except "/test"

// Postman test: Check if Route is Running
router.get("/test", (req, res) => {
    res.json({ message: "✅ DB Test Route is working!" });
});


// Postman test: Insert a User
router.post("/test-insert", (req, res) => {
    const { email, password, firstname, lastname, contact, role } = req.body;
    const sql = "INSERT INTO users (user_email, user_password, user_firstname, user_lastname, user_contact, user_role) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [email, password, firstname, lastname, contact, role], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ User inserted successfully!", userId: result.insertId });
    });
});

// Postman test: Update a User
router.put("/test-update", (req, res) => {
    const { userId, newPassword } = req.body;
    const sql = "UPDATE users SET user_password = ? WHERE user_id = ?";
    const commitSql = "COMMIT"
    
    db.query(sql, [newPassword, userId], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "❌ No user found with this ID" });
        }

        db.query(commitSql, () => {
            res.json({ message: "✅ User updated successfully!", affectedRows: result.affectedRows });
        });
    });
});

// Postman test: Delete a User
router.delete("/test-delete", (req, res) => {
    const { userId } = req.body;
    const sql = "DELETE FROM users WHERE user_id = ?";
    
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ User deleted successfully!", affectedRows: result.affectedRows });
    });
});

module.exports = router;
