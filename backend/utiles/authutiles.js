
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { TOKEN_KEY } = process.env;

function generateToken(user_id, email) {
  const token = jwt.sign({ user_id, email }, TOKEN_KEY, { expiresIn: "15d" });
  return token;
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = { generateToken, hashPassword, comparePasswords };
