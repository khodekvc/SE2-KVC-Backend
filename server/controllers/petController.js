const db = require("../config/db");

// Update pet profile (only for clinicians and doctors)
exports.updatePetProfile = async (req, res) => {
    const { pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status } = req.body;
    const { pet_id } = req.params; // Extract pet_id from URL
    const userRole = req.session.user?.role; // Get user role from session

    console.log("Received update request:", { pet_id, pet_name, pet_species, pet_gender, pet_status });

    // Check if the user has permission
    if (!userRole || (userRole !== "doctor" && userRole !== "clinician")) {
        return res.status(403).json({ error: "❌ Unauthorized. Only doctors and clinicians can edit pets." });
    }

    // Validate required fields (Cannot be null or empty)
    if (!pet_name || !pet_species || !pet_gender || pet_status === undefined) {
        return res.status(400).json({ error: "❌ pet_name, pet_species, pet_gender, and pet_status are required!" });
    }

    try {
        // Check if the pet exists
        const [existingPet] = await db.execute("SELECT * FROM pet_info WHERE pet_id = ?", [pet_id]);

        if (existingPet.length === 0) {
            return res.status(404).json({ error: "❌ Pet not found. Cannot update." });
        }

        // Update pet profile
        const [result] = await db.execute(
            `UPDATE pet_info 
            SET pet_name = ?, pet_species = ?, pet_breed = ?, pet_gender = ?, pet_birthday = ?, pet_color = ?, pet_status = ? 
            WHERE pet_id = ?`,
            [pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status, pet_id]
        );

        console.log("Update Result:", result); // Debugging log

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "❌ No changes made. Either the pet ID does not exist or the new data is the same as the current data." });
        }

        res.json({ message: "✅ Pet profile updated successfully!" });

    } catch (error) {
        console.error("Pet Profile Update Error:", error);
        res.status(500).json({ error: "❌ Server error while updating pet profile." });
    }
};
