const db = require("../config/db");

class PetModel {
    // Method to check if the pet exists
    static async findById(pet_id) {
        const [result] = await db.execute("SELECT * FROM pet_info WHERE pet_id = ?", [pet_id]);
        return result.length ? result[0] : null;
    }

    // Method to update pet profile
    static async updatePet(pet_id, pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status) {
        const [result] = await db.execute(
            `UPDATE pet_info 
            SET pet_name = ?, pet_species = ?, pet_breed = ?, pet_gender = ?, pet_birthday = ?, pet_color = ?, pet_status = ? 
            WHERE pet_id = ?`,
            [pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status, pet_id]
        );
        return result;
    }
}

module.exports = PetModel;
