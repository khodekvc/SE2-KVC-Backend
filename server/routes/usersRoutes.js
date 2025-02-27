const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();

// Update profile
router.put("/update-profile", usersController.updateProfile);

// Change password
router.put("/change-password", usersController.changePassword);

module.exports = router;