const { insertLabInfo, insertDiagnosis, insertSurgeryInfo, insertRecord } = require("../models/recordModel");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const addRecord = async (req, res) => {
    try {
        const { petId } = req.params; // Pet ID from URL
        const { 
            record_date, record_weight, record_temp, record_condition, record_symptom, 
            lab_description, diagnosis_text, surgery_type, surgery_date, 
            record_recent_visit, record_purchase, record_purpose 
        } = req.body;
        
        // Validate required fields
        if (!record_date || !record_weight || !record_temp || !record_condition || !record_symptom || !record_recent_visit || !record_purchase || !record_purpose) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        
        // Insert Lab Info (if provided)
        let lab_id = null;
        if (lab_description) {
            lab_id = await insertLabInfo(lab_description);
        }
        
        // Insert Diagnosis (if provided)
        let diagnosis_id = null;
        if (diagnosis_text) {
            diagnosis_id = await insertDiagnosis(diagnosis_text);
        }
        
        // Insert Surgery Info (if provided)
        let surgery_id = null;
        if (surgery_type && surgery_date) {
            surgery_id = await insertSurgeryInfo(surgery_type, surgery_date);
        }
        
        // Insert into record_info table
        await insertRecord(petId, { record_date, record_weight, record_temp, record_condition, 
            record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id });
        
        res.status(201).json({ message: "Medical record added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while adding medical record." });
    }
};

module.exports = { addRecord };
