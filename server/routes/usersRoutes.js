const express = require("express");
const usersController = require("../controllers/usersController");
const { authenticate } = require("../middleware/authMiddleware"); // Import authentication middleware
const router = express.Router();

// Update profile (Protected route)
router.put("/update-employee-profile", authenticate, usersController.updateEmployeeProfile);
router.put("/update-petowner-profile", authenticate, usersController.updateOwnerProfile);

// Change password (Protected route)
router.post("/change-password", authenticate, usersController.changePassword);

module.exports = router;
