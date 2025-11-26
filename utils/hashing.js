const { hash, compare } = require("bcryptjs");
const crypto = require("crypto");

const doHashing = (value, saltValue) => {
  const result = hash(value, saltValue);
  return result;
};

const comparePassword = (plainValue, hashedValue) => {
  const result = compare(plainValue, hashedValue);
  return result;
};

const hmacProcess = (value, key) => {
  return crypto.createHmac("sha256", key).update(value).digest("hex");
};

module.exports = {
  doHashing,
  comparePassword,
  hmacProcess,
};
