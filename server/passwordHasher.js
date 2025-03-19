const { hashPassword } = require('./utils/passwordUtility');

const password = '12345678'; // Replace with the password you want to hash

hashPassword(password)
    .then(hashedPassword => {
        console.log('Hashed password:', hashedPassword);
    })
    .catch(err => {
        console.error('Error hashing password:', err);
    });