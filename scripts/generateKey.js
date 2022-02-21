import fs from "fs";
import crypto from "crypto";
function generateKey(keyLength) {
    return crypto.randomBytes(keyLength).toString("hex");
}

if (require.main === module) {
    fs.writeFileSync(__dirname + "/../jwt.key", generateKey(64));
}
