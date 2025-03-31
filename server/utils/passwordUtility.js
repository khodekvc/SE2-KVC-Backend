const bcrypt = require("bcryptjs"); // Changed from 'bcrypt' to 'bcryptjs'

/**
 * Hashes a password using bcryptjs.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 */
const hashPassword = async (password) => {
    const saltRounds = 10; // Standard number of rounds
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plain text password with a stored bcryptjs hash.
 * @param {string} enteredPassword - The plain text password entered by the user.
 * @param {string} storedHash - The hash stored in the database.
 * @returns {Promise<boolean>} A promise that resolves with true if passwords match, false otherwise.
 */
const comparePassword = async (enteredPassword, storedHash) => {
    return await bcrypt.compare(enteredPassword, storedHash);
};

module.exports = { hashPassword, comparePassword };