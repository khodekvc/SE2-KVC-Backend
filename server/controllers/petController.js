const PetModel = require("../models/petModel");

// Update pet profile (only for clinicians and doctors)
<<<<<<< Updated upstream
exports.updatePetProfile = [// Check if the user is a doctor or clinician
    async (req, res) => {
        const { pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status } = req.body;
        const { pet_id } = req.params; // Extract pet_id from URL
=======

exports.updatePetProfile = async (req, res) => {
    const { pet_id } = req.params;
    const updateFields = req.body;
>>>>>>> Stashed changes

        console.log("Received update request:", { pet_id, pet_name, pet_species, pet_gender, pet_status });

        // Validate required fields (Cannot be null or empty)
        if (!pet_name || !pet_species || !pet_gender || pet_status === undefined) {
            return res.status(400).json({ error: "❌ pet_name, pet_species, pet_gender, and pet_status are required!" });
        }

<<<<<<< Updated upstream
        try {
            // Check if the pet exists using the PetModel
            const existingPet = await PetModel.findById(pet_id);
=======
        let updatedData = {};
        Object.keys(updateFields).forEach((key) => {
            if (updateFields[key] !== undefined && updateFields[key] !== "") {
                updatedData[key] = updateFields[key];
            }
        });
>>>>>>> Stashed changes

            if (!existingPet) {
                return res.status(404).json({ error: "❌ Pet not found. Cannot update." });
            }

            // Update pet profile using the PetModel
            const result = await PetModel.updatePet(pet_id, pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status);

            console.log("Update Result:", result); // Debugging log

<<<<<<< Updated upstream
            if (result.affectedRows === 0) {
                return res.status(400).json({ error: "❌ No changes made. Either the pet ID does not exist or the new data is the same as the current data." });
            }

            res.json({ message: "✅ Pet profile updated successfully!" });

        } catch (error) {
            console.error("Pet Profile Update Error:", error);
            res.status(500).json({ error: "❌ Server error while updating pet profile." });
        }
=======
                if (
                    updatedData.pet_age_year !== computedYears ||
                    updatedData.pet_age_month !== computedMonths
                ) {
                    return res.status(400).json({
                        error: `❌ Age mismatch! The computed age based on birthday is ${computedYears} years and ${computedMonths} months.`,
                    });
                }
            }
        }

        // If no valid fields are provided, return an error
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ error: "❌ No valid fields to update." });
        }

        // Perform the update
        const result = await PetModel.updatePet(pet_id, updatedData);

        console.log("Update Result:", result);
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "❌ No changes made (pet ID may not exist or data is the same)." });
        }

        res.json({ message: "✅ Pet profile updated successfully!" });

    } catch (error) {
        console.error("Pet Profile Update Error:", error);
        res.status(500).json({ error: "❌ Server error: " + error.message });
>>>>>>> Stashed changes
    }
];









exports.archivePet = async (req, res) => {
    const { pet_id } = req.params;

    try {
        const pet = await PetModel.findById(pet_id);
        if (!pet) {
            return res.status(404).json({ error: "❌ Pet not found!" });
        }

        await PetModel.archivePet(pet_id);
        res.json({ message: `✅ Pet ${pet.pet_name} archived successfully!` });
    } catch (error) {
        console.error("Archive Pet Error:", error);
        res.status(500).json({ error: "❌ Server error during archiving pet." });
    }
};

exports.restorePet = async (req, res) => {
    const { pet_id } = req.params;

    try {
        const pet = await PetModel.findById(pet_id);
        if (!pet) {
            return res.status(404).json({ error: "❌ Pet not found!" });
        }

        await PetModel.restorePet(pet_id);
        res.json({ message: `✅ Pet ${pet.pet_name} restored successfully!` });
    } catch (error) {
        console.error("Restore Pet Error:", error);
        res.status(500).json({ error: "❌ Server error during restoring pet." });
    }
};

exports.getAllActivePets = async (req, res) => {
    try {
        // Fetch active pets where pet_status is "active"
        const activePets = await Pet.find({ pet_status: "active" });
        res.status(200).json(activePets);
    } catch (error) {
        res.status(500).json({ error: "❌ Error fetching active pets." });
    }
};

exports.getAllArchivedPets = async (req, res) => {
    try {
        // Fetch archived pets where pet_status is "archived"
        const archivedPets = await Pet.find({ pet_status: "archived" });
        res.status(200).json(archivedPets);
    } catch (error) {
        res.status(500).json({ error: "❌ Error fetching archived pets." });
    }
};
