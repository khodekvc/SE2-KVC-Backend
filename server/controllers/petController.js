const PetModel = require("../models/petModel");

// Update pet profile (only for clinicians and doctors)
exports.updatePetProfile = [// Check if the user is a doctor or clinician
    async (req, res) => {
        const { pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status } = req.body;
        const { pet_id } = req.params; // Extract pet_id from URL

        console.log("Received update request:", { pet_id, pet_name, pet_species, pet_gender, pet_status });

        // Validate required fields (Cannot be null or empty)
        if (!pet_name || !pet_species || !pet_gender || pet_status === undefined) {
            return res.status(400).json({ error: "❌ pet_name, pet_species, pet_gender, and pet_status are required!" });
        }

        try {
            // Check if the pet exists using the PetModel
            const existingPet = await PetModel.findById(pet_id);

            if (!existingPet) {
                return res.status(404).json({ error: "❌ Pet not found. Cannot update." });
            }

            // Update pet profile using the PetModel
            const result = await PetModel.updatePet(pet_id, pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status);

            console.log("Update Result:", result); // Debugging log

            if (result.affectedRows === 0) {
                return res.status(400).json({ error: "❌ No changes made. Either the pet ID does not exist or the new data is the same as the current data." });
            }

            res.json({ message: "✅ Pet profile updated successfully!" });

        } catch (error) {
            console.error("Pet Profile Update Error:", error);
            res.status(500).json({ error: "❌ Server error while updating pet profile." });
        }
    }
];
