const db = require("../config/db");

class PetModel {
    static async findById(pet_id) {
        const [result] = await db.execute("SELECT * FROM pet_info WHERE pet_id = ?", [pet_id]);
        return result.length ? result[0] : null;
    }

    static async createPet({ petname, gender, species, breed, birthdate, userId }) {
        return db.query(
            "INSERT INTO pet_info (pet_name, pet_gender, pet_species, pet_breed, pet_birthday, pet_vitality, pet_status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [petname, gender, species, breed, birthdate, true, true, userId]
        );
    }

    static async updatePet(pet_id, pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status) {
        const [result] = await db.execute(
            `UPDATE pet_info 
            SET pet_name = ?, pet_species = ?, pet_breed = ?, pet_gender = ?, pet_birthday = ?, pet_color = ?, pet_status = ? 
            WHERE pet_id = ?`,
            [pet_name, pet_species, pet_breed, pet_gender, pet_birthday, pet_color, pet_status, pet_id]
        );
        return result;
    }
<<<<<<< Updated upstream
=======
    
    
    
>>>>>>> Stashed changes

    static async archivePet(pet_id) {
        return db.execute("UPDATE pet_info SET pet_status = 0 WHERE pet_id = ?", [pet_id]);
    }

    static async restorePet(pet_id) {
        return db.execute("UPDATE pet_info SET pet_status = 1 WHERE pet_id = ?", [pet_id]);
    }

    static async getAllActivePets() {
        const [result] = await db.execute("SELECT * FROM pet_info WHERE pet_status = 1");
        return result;
    }

    static async getAllArchivedPets() {
        const [result] = await db.execute("SELECT * FROM pet_info WHERE pet_status = 0");
        return result;
    }
}

module.exports = PetModel;
