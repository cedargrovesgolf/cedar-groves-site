/* hash.js */
const bcrypt = require('bcrypt');

const saltRounds = 10;
const dummyHash = bcrypt.hashSync('', saltRounds);

function hash(password) {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

async function compareHash(password, storedHash) {
  const matches = await bcrypt.compare(password, storedHash ?? dummyHash);
  return Boolean(storedHash) && matches;
}

module.exports = {
  hash,
  compareHash
};
