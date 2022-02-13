const fs = require("fs");
const crypto = require("crypto");

function generateKey(keyLength) {
    return crypto.randomBytes(keyLength).toString("hex");
}

if (require.main === module) {
    fs.writeFileSync(__dirname + "/../cookie.key", generateKey(64));
}
