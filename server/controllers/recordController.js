const { insertDiagnosis, insertSurgeryInfo, insertRecord, insertMatchRecLab, getLabIdByDescription, updateRecordInDB, updateMatchRecLab, getRecordById } = require("../models/recordModel");
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
        
        // Fetch current record data
        const currentRecord = await getRecordById(recordId);
        if (!currentRecord) {
            return res.status(404).json({ error: "Record not found." });
        }
        
        // Merge current record data with new data
        const updatedRecordData = {
            record_date: record_date || currentRecord.record_date,
            record_weight: record_weight || currentRecord.record_weight,
            record_temp: record_temp || currentRecord.record_temp,
            record_condition: record_condition || currentRecord.record_condition,
            record_symptom: record_symptom || currentRecord.record_symptom,
            record_recent_visit: record_recent_visit || currentRecord.record_recent_visit,
            record_purchase: record_purchase || currentRecord.record_purchase,
            record_purpose: record_purpose || currentRecord.record_purpose,
            lab_id: currentRecord.lab_id,
            diagnosis_id: currentRecord.diagnosis_id,
            surgery_id: currentRecord.surgery_id,
            record_lab_file: currentRecord.record_lab_file
        };
        
        // Get Lab ID by description (if provided)
        if (lab_description) {
            const lab_id = await getLabIdByDescription(lab_description);
            if (!lab_id) {
                return res.status(400).json({ error: "Invalid lab description." });
            }
            updatedRecordData.lab_id = lab_id;
        }
        
        // Insert Diagnosis (if provided)
        if (diagnosis_text) {
            const diagnosis_id = await insertDiagnosis(diagnosis_text);
            updatedRecordData.diagnosis_id = diagnosis_id;
        }
        
        // Insert Surgery Info (if provided)
        if (surgery_type && surgery_date) {
            const surgery_id = await insertSurgeryInfo(surgery_type, surgery_date);
            updatedRecordData.surgery_id = surgery_id;
        }
        
        // Update the record_info table
        await updateRecordInDB(recordId, updatedRecordData);
        
        // Update the match_rec_lab table
        if (updatedRecordData.lab_id !== currentRecord.lab_id) {
            await updateMatchRecLab(recordId, updatedRecordData.lab_id);
        }
        
        res.status(200).json({ message: "Medical record updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while updating medical record." });
    }
};

module.exports = { addRecord, updateRecord };
