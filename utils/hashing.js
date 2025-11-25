const { hash } = require("bcryptjs");

const doHashing = (value, saltValue) => {
  const result = hash(value, saltValue);
  return result;
};

module.exports = doHashing;
