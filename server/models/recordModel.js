const db = require("../config/db");

const insertLabInfo = async (lab_description) => {
    const [labResult] = await db.query("INSERT INTO lab_info (lab_description) VALUES (?)", [lab_description]);
    return labResult.insertId;
};

const getLabIdByDescription = async (lab_description) => {
    const [result] = await db.query("SELECT lab_id FROM lab_info WHERE lab_description = ?", [lab_description]);
    return result.length ? result[0].lab_id : null;
};

const insertDiagnosis = async (diagnosis_text) => {
    const [diagResult] = await db.query("INSERT INTO diagnosis (diagnosis_text) VALUES (?)", [diagnosis_text]);
    return diagResult.insertId;
};

const insertSurgeryInfo = async (surgery_type, surgery_date) => {
    const [surgeryResult] = await db.query("INSERT INTO surgery_info (surgery_type, surgery_date) VALUES (?, ?)", [surgery_type, surgery_date]);
    return surgeryResult.insertId;
};

const insertRecord = async (petId, recordData) => {
    const { record_date, record_weight, record_temp, record_condition, record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id, record_lab_file } = recordData;
    const [result] = await db.query(
        `INSERT INTO record_info (pet_id, record_date, record_weight, record_temp, record_condition, 
            record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id, record_lab_file)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [petId, record_date, record_weight, record_temp, record_condition, record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id, record_lab_file]
    );
    return result.insertId;
};

const updateRecordInDB = async (recordId, recordData) => {
    const { record_date, record_weight, record_temp, record_condition, record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id, record_lab_file } = recordData;
    const [result] = await db.query(
        `UPDATE record_info SET record_date = ?, record_weight = ?, record_temp = ?, record_condition = ?, 
            record_symptom = ?, record_recent_visit = ?, record_purchase = ?, record_purpose = ?, lab_id = ?, diagnosis_id = ?, surgery_id = ?, record_lab_file = ?
        WHERE record_id = ?`,
        [record_date, record_weight, record_temp, record_condition, record_symptom, record_recent_visit, record_purchase, record_purpose, lab_id, diagnosis_id, surgery_id, record_lab_file, recordId]
    );
    return result.affectedRows;
};

const insertMatchRecLab = async (recordId, labId) => {
    await db.query("INSERT INTO match_rec_lab (record_id, lab_id) VALUES (?, ?)", [recordId, labId]);
};

const updateMatchRecLab = async (recordId, labId) => {
    await db.query("DELETE FROM match_rec_lab WHERE record_id = ?", [recordId]);
    await db.query("INSERT INTO match_rec_lab (record_id, lab_id) VALUES (?, ?)", [recordId, labId]);
};

module.exports = { insertLabInfo, getLabIdByDescription, insertDiagnosis, insertSurgeryInfo, insertRecord, updateRecordInDB, insertMatchRecLab, updateMatchRecLab };
