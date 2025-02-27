const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Route to update pet profile (only for clinicians and doctors)
router.put("/edit/:pet_id", authenticate, authorize(["clinician", "doctor"]), petController.updatePetProfile);


module.exports = router;
