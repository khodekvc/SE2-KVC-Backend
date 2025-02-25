const bcrypt = require("bcrypt");

// Hash password before storing
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Compare entered password with stored hash
const comparePassword = async (enteredPassword, storedHash) => {
    return await bcrypt.compare(enteredPassword, storedHash);
};

module.exports = { hashPassword, comparePassword };
