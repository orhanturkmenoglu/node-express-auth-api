const { hash, compare } = require("bcryptjs");

const doHashing = (value, saltValue) => {
  const result = hash(value, saltValue);
  return result;
};

const verifyPassword = (plainValue, hashedValue) => {
    const result = compare(plainValue, hashedValue);
    return result;
};

module.exports = {
    doHashing,
    verifyPassword
}
