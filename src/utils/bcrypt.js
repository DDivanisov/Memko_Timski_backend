const bycript = require('bcrypt');

const hashPassword = async (password) => {
      const saltRounds = 10;
      const hashedPassword = await bycript.hash(password, saltRounds);
      return hashedPassword;
}

const comparePassword = async (password, hashedPassword) => {
      return await bycript.compare(password, hashedPassword);
}

module.exports = {hashPassword, comparePassword};