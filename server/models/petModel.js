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

    static async updatePet(pet_id, updatedData) {
        const updateFields = Object.keys(updatedData);
        if (updateFields.length === 0) return { affectedRows: 0 }; // No fields to update
    
        const setClause = updateFields.map(field => `${field} = ?`).join(", ");
        const values = updateFields.map(field => updatedData[field]);
    
        const sql = `UPDATE pet_info SET ${setClause} WHERE pet_id = ?`;
        values.push(pet_id); // Append pet_id for WHERE clause
    
        const [result] = await db.execute(sql, values);
        return result;
    }
    
    
    

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
