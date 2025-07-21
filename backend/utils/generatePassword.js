const crypto = require("crypto");
function generateRandomPassword() {
  const randomPart = crypto
    .randomBytes(8)
    .toString("base64")
    .replace(/[+/=]/g, "")
    .slice(0, 9);
  return `${randomPart}`;
}

module.exports = generateRandomPassword;
