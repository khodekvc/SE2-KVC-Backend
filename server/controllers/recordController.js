const { insertDiagnosis, insertSurgeryInfo, insertRecord, insertMatchRecLab, getLabIdByDescription, updateRecordInDB, updateMatchRecLab } = require("../models/recordModel");
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
        
        // Get Lab ID by description (if provided)
        let lab_id = null;
        if (lab_description) {
            lab_id = await getLabIdByDescription(lab_description);
            if (!lab_id) {
                return res.status(400).json({ error: "Invalid lab description." });
            }
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
        const recordId = await insertRecord(petId, { record_date, record_weight, record_temp, record_condition, 
            record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id, record_lab_file: null });
        
        // Insert into match_rec_lab table
        if (lab_id) {
            await insertMatchRecLab(recordId, lab_id);
        }
        
        res.status(201).json({ message: "Medical record added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while adding medical record." });
    }
};

const updateRecord = async (req, res) => {
    try {
        const { recordId } = req.params; // Record ID from URL
        const { 
            record_date, record_weight, record_temp, record_condition, record_symptom, 
            lab_description, diagnosis_text, surgery_type, surgery_date, 
            record_recent_visit, record_purchase, record_purpose 
        } = req.body;
        
        // Validate required fields
        if (!record_date || !record_weight || !record_temp || !record_condition || !record_symptom || !record_recent_visit || !record_purchase || !record_purpose) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        
        // Get Lab ID by description (if provided)
        let lab_id = null;
        if (lab_description) {
            lab_id = await getLabIdByDescription(lab_description);
            if (!lab_id) {
                return res.status(400).json({ error: "Invalid lab description." });
            }
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
        
        // Update the record_info table
        await updateRecordInDB(recordId, { record_date, record_weight, record_temp, record_condition, 
            record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id, record_lab_file: null });
        
        // Update the match_rec_lab table
        if (lab_id) {
            await updateMatchRecLab(recordId, lab_id);
        }
        
        res.status(200).json({ message: "Medical record updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while updating medical record." });
    }
};

module.exports = { addRecord, updateRecord };
