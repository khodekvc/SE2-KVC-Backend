const db = require("../config/db");

const insertLabInfo = async (lab_description) => {
    const [labResult] = await db.query("INSERT INTO lab_info (lab_description) VALUES (?)", [lab_description]);
    return labResult.insertId; // Corrected from RETURNING to insertId
};

const insertDiagnosis = async (diagnosis_text) => {
    const [diagResult] = await db.query("INSERT INTO diagnosis (diagnosis_text) VALUES (?)", [diagnosis_text]);
    return diagResult.insertId; // Corrected from RETURNING to insertId
};

const insertSurgeryInfo = async (surgery_type, surgery_date) => {
    const [surgeryResult] = await db.query("INSERT INTO surgery_info (surgery_type, surgery_date) VALUES (?, ?)", [surgery_type, surgery_date]);
    return surgeryResult.insertId; // Corrected from RETURNING to insertId
};

const insertRecord = async (petId, recordData) => {
    const { record_date, record_weight, record_temp, record_condition, record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id } = recordData;
    await db.query(
        `INSERT INTO record_info (pet_id, record_date, record_weight, record_temp, record_condition, 
            record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [petId, record_date, record_weight, record_temp, record_condition, record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id]
    );
};

module.exports = { insertLabInfo, insertDiagnosis, insertSurgeryInfo, insertRecord };
