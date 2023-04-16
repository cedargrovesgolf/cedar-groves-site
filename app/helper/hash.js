/* hash.js */
const bcrypt = require('bcrypt');

function hash(password) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

function compareHash(password, storedHash) {
  return bcrypt.compareSync(password, storedHash);
}

module.exports = {
  hash,
  compareHash
};
