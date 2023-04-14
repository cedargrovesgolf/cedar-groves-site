/* hash.js */
const prompt = require("prompt-sync")({ sigint: true });
const bcrypt = require('bcrypt');

const password = prompt("Password: ");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(password, salt);

console.log(`Generated Hash: ${hash}`);

