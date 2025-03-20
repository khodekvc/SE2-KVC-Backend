const express = require("express");
const { addRecord } = require("../controllers/recordController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Only doctors and clinicians can add records
router.post("/:petId", authenticate, authorize({ roles: ["doctor", "clinician"] }), addRecord);

module.exports = router;