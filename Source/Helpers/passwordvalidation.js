const bcrypt = require('bcrypt');

const checkPassword = async (password, dbPassword) => {
    const decryptedPassword = await bcrypt.compare(password, dbPassword);
    return decryptedPassword;
};

module.exports = { checkPassword };
