const crypto = require("crypto");
const fs = require("fs");

function generateKey(keyLength) {
    return crypto.randomBytes(keyLength).toString("hex");
}

fs.writeFileSync(__dirname + "/../cookie.key", generateKey(64));
