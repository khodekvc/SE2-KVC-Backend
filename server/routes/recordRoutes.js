const express = require("express");
const { addRecord, updateRecord } = require("../controllers/recordController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Only doctors and clinicians can add records
router.post("/:petId", authenticate, authorize({ roles: ["doctor", "clinician"] }), addRecord);

// Only doctors and clinicians can update recordsn
router.put("/:recordId", authenticate, authorize({ roles: ["doctor", "clinician"] }), updateRecord);

module.exports = router;