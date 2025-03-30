// recordController.js 

const {
    insertDiagnosis, insertSurgeryInfo, insertRecord, insertMatchRecLab,
    getLabIdByDescription, updateRecordInDB, updateMatchRecLab, getRecordById, updateDiagnosisText
} = require("../models/recordModel");
// const { authenticate, authorize } = require("../middleware/authMiddleware"); // Only if used by addRecord directly
const { sendEmail } = require("../utils/emailUtility"); 
const crypto = require("crypto");

// Ensure clinicians request an access code before adding a diagnosis
const addRecord = async (req, res) => {
    try {
        // Ensure req.user exists and has role property
        if (!req.user || typeof req.user.role === 'undefined') {
           console.error("User role not found in request object in addRecord.");
           return res.status(401).json({ error: "Authentication required or user data missing." });
        }
        const { role } = req.user;
        const { petId } = req.params;

        // Check if petId is provided
        if (!petId) {
            return res.status(400).json({ error: "Missing petId in URL parameters." });
        }

        const {
            record_date, record_weight, record_temp, record_condition, record_symptom,
            lab_description, diagnosis_text, surgery_type, surgery_date,
            record_recent_visit, record_purchase, record_purpose
        } = req.body;

        // Validate required fields
        // Removed diagnosis_text from required fields as it's conditional
        if (!record_date || record_weight === undefined || record_weight === null || record_temp === undefined || record_temp === null || !record_condition || !record_symptom || !record_recent_visit || !record_purchase || !record_purpose) {
            console.log("Missing required fields in addRecord:", { record_date, record_weight, record_temp, record_condition, record_symptom, record_recent_visit, record_purchase, record_purpose });
            return res.status(400).json({ error: "Missing required fields." });
        }

        // ❌ Prevent clinicians from adding diagnosis
        if (role === "clinician" && diagnosis_text) {
            return res.status(403).json({ error: "Clinicians cannot add a diagnosis when creating a record." });
        }

        let lab_id = null;
        if (lab_description) {
            lab_id = await getLabIdByDescription(lab_description);
            if (!lab_id) {
                return res.status(400).json({ error: "Invalid lab description." });
            }
        }

        let diagnosis_id = null;
        if (role === "doctor" && diagnosis_text) {
            diagnosis_id = await insertDiagnosis(diagnosis_text);
        }

        let surgery_id = null;
        if (surgery_type && surgery_date) {
            surgery_id = await insertSurgeryInfo(surgery_type, surgery_date);
        }

        const recordData = {
            record_date, record_weight, record_temp, record_condition,
            record_symptom, record_recent_visit, record_purchase,
            record_purpose, lab_id, diagnosis_id, surgery_id, record_lab_file: null // Assuming default null
        };

        const recordId = await insertRecord(petId, recordData);

        // Check if record insertion was successful (assuming insertRecord returns the ID or throws error)
        if (!recordId) {
             throw new Error("Failed to insert record, recordId not returned.");
        }

        // Only insert into MatchRecLab if a lab was actually linked
        if (lab_id) {
            await insertMatchRecLab(recordId, lab_id);
        }

        res.status(201).json({ message: "Medical record added successfully!", recordId: recordId }); // Optionally return the new ID
    } catch (error) {
        console.error("Error in addRecord:", error); // Log the actual error
        res.status(500).json({ error: "Server error while adding medical record." });
    }
};

const updateRecord = async (req, res) => {
    try {
        const { role } = req.user;
        const { recordId } = req.params;
        const {
            record_date, record_weight, record_temp, record_condition, record_symptom,
            lab_description, diagnosis_text, surgery_type, surgery_date,
            record_recent_visit, record_purchase, record_purpose, accessCode
        } = req.body;

        const currentRecord = await getRecordById(recordId);
        if (!currentRecord) {
            return res.status(404).json({ error: "Record not found." });
        }

        // 🔒 Enforce access code for clinicians trying to update a diagnosis
        // Ensure req.session is checked before accessing properties on it
        if (role === "clinician" && req.body.diagnosis_text) { // Check if diagnosis_text exists in body
            // Check if session and code exist *before* comparing
            // Ensure session exists AND the code property is specifically present
            if (!req.session || typeof req.session.diagnosisAccessCode === 'undefined' || accessCode !== req.session.diagnosisAccessCode) {
                console.log("Clinician access code check failed:", {
                    hasSession: !!req.session,
                    sessionCode: req.session?.diagnosisAccessCode, // Use optional chaining for logging safety
                    providedCode: accessCode
                });
                return res.status(403).json({ error: "Clinicians need a valid access code to update a diagnosis." });
            }
            console.log("Clinician access code check passed.");
        }


        // Doctors can update without an access code

        const updatedRecordData = {
            record_date: record_date !== undefined ? record_date : currentRecord.record_date,
            record_weight: record_weight !== undefined ? record_weight : currentRecord.record_weight,
            record_temp: record_temp !== undefined ? record_temp : currentRecord.record_temp,
            record_condition: record_condition !== undefined ? record_condition : currentRecord.record_condition,
            record_symptom: record_symptom !== undefined ? record_symptom : currentRecord.record_symptom,
            record_recent_visit: record_recent_visit !== undefined ? record_recent_visit : currentRecord.record_recent_visit,
            record_purchase: record_purchase !== undefined ? record_purchase : currentRecord.record_purchase,
            record_purpose: record_purpose !== undefined ? record_purpose : currentRecord.record_purpose,
            lab_id: currentRecord.lab_id, // Start with current values
            diagnosis_id: currentRecord.diagnosis_id,
            surgery_id: currentRecord.surgery_id,
            record_lab_file: currentRecord.record_lab_file // Ensure this is preserved
        };
         console.log("Initial updatedRecordData:", updatedRecordData);


        // --- Lab Update ---
        let labIdToUpdate = currentRecord.lab_id; // Use a temporary variable
        if (lab_description) {
            const found_lab_id = await getLabIdByDescription(lab_description);
            if (!found_lab_id) {
                return res.status(400).json({ error: "Invalid lab description." });
            }
             if (found_lab_id !== currentRecord.lab_id) {
                 labIdToUpdate = found_lab_id; // Only update if different
                 updatedRecordData.lab_id = found_lab_id; // Update the final data object
                  console.log("Lab ID updated to:", found_lab_id);
             }
        }


        // --- Diagnosis Update ---
        if (req.body.diagnosis_text) {
            let canUpdateDiagnosis = false;
            if (role === "doctor") {
                canUpdateDiagnosis = true;
            } else if (role === "clinician") {
                // Re-check access code validity (already done above, but ensures logic flow)
                 if (req.session && req.session.diagnosisAccessCode && accessCode === req.session.diagnosisAccessCode) {
                     canUpdateDiagnosis = true;
                     // Clear the code after use? Optional, depends on desired flow.
                     // delete req.session.diagnosisAccessCode;
                 } else {
                     // This path should ideally not be reached due to the check at the start,
                     // but included for robustness.
                     console.log("Clinician check failed again during diagnosis update block.");
                     return res.status(403).json({ error: "Invalid or missing access code for diagnosis update." });
                 }
            }

            if (canUpdateDiagnosis) {
                console.log(`Role ${role} allowed to update diagnosis.`);
                if (!currentRecord.diagnosis_id) {
                    const newDiagnosisId = await insertDiagnosis(req.body.diagnosis_text);
                    updatedRecordData.diagnosis_id = newDiagnosisId;
                    console.log(`New diagnosis inserted (ID: ${newDiagnosisId}) and linked to record.`);
                } else {
                    await updateDiagnosisText(currentRecord.diagnosis_id, req.body.diagnosis_text);
                    updatedRecordData.diagnosis_id = currentRecord.diagnosis_id;
                    console.log(`Existing diagnosis (ID: ${currentRecord.diagnosis_id}) updated.`);
                }
            }
      } else {
           updatedRecordData.diagnosis_id = currentRecord.diagnosis_id;
      }


        // --- Surgery Update ---
        // Only insert if BOTH type and date are provided AND they are new/different
        // (Assuming surgery info is immutable once set, or requires a different update mechanism)
        // If surgery can be *changed*, this logic needs adjustment. Assuming adding new surgery link.
        if (surgery_type && surgery_date) {
            // You might want logic here to check if surgery already exists and prevent duplicates
            // or update existing. For simplicity, inserting new and linking:
            const new_surgery_id = await insertSurgeryInfo(surgery_type, surgery_date);
            updatedRecordData.surgery_id = new_surgery_id; // Link the new surgery
            console.log("New surgery info inserted and linked (ID:", new_surgery_id, ")");
        } else {
             updatedRecordData.surgery_id = currentRecord.surgery_id; // Preserve existing if no new one provided
        }

        console.log("Final updatedRecordData before DB update:", updatedRecordData);

        // --- Final Database Updates ---
        // ❌ REMOVE THE FIRST CALL: await updateRecordInDB(recordId, updatedRecordData);
        
        // ✅ Perform the main record update ONCE with all collected changes
        await updateRecordInDB(recordId, updatedRecordData);
        console.log("Record info updated in DB.");

        if (updatedRecordData.lab_id !== currentRecord.lab_id) { // Check if lab actually changed
             await updateMatchRecLab(recordId, updatedRecordData.lab_id); // Use the ID from updated data
             console.log("MatchRecLab updated.");
        }


        res.status(200).json({ message: "Medical record updated successfully!" });

    } catch (error) {
        console.error("Error in updateRecord:", error);
        res.status(500).json({ error: "Server error while updating medical record." });
    }
};

// Ensure the requestDiagnosisAccessCode also checks session robustly
const requestDiagnosisAccessCode = async (req, res) => {
    try {
        if (!req.session) {
             console.error("Session object not found on request in requestDiagnosisAccessCode.");
            return res.status(500).json({ error: "❌ Session is not initialized or unavailable." });
        }

        const accessCode = crypto.randomBytes(4).toString("hex").toUpperCase();
        req.session.diagnosisAccessCode = accessCode; // Assign code to session

        const clinicOwnerEmail = process.env.CLINIC_OWNER_EMAIL;
        if (!clinicOwnerEmail) {
             console.error("CLINIC_OWNER_EMAIL environment variable not set.");
            return res.status(500).json({ error: "❌ Clinic owner email is not set." });
        }

        const subject = "Diagnosis Access Code Request - PAWtient Tracker";
        const body = `Hello Clinic Owner,\n\nA clinician has requested an access code to add or edit a diagnosis.\n\nAccess Code: ${accessCode}\n\nIf this request is unauthorized, please ignore this email.`;

        await sendEmail(clinicOwnerEmail, subject, body);

        // ⭐ --- ADD EXPLICIT SESSION SAVE --- ⭐
        req.session.save(err => {
            if (err) {
                console.error("Error saving session in requestDiagnosisAccessCode:", err);
                // Return an error if session saving fails
                return res.status(500).json({ error: "❌ Server error while saving session state." });
            }
            // Session saved, now send the response
            console.log(`Session saved successfully. diagnosisAccessCode: ${req.session.diagnosisAccessCode}`); // Log confirmation
            res.status(200).json({ message: "✅ Access code request sent. Await access code from the clinic owner." });
        });
        // ⭐ --- END OF ADDED SAVE --- ⭐

    } catch (error) {
        console.error("Error in requestDiagnosisAccessCode:", error);
        if (error.message.includes('session')) {
             res.status(500).json({ error: "❌ Server error related to session handling." });
        } else {
             res.status(500).json({ error: "❌ Server error while requesting access code." });
        }
    }
};


module.exports = { addRecord, updateRecord, requestDiagnosisAccessCode };