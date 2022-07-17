const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

try {
    fs.rmSync(path.resolve(__dirname, "lib"), { recursive: true });
} catch {}

execSync("tsc -p tsconfig.cjs.json");
execSync("tsc -p tsconfig.esm.json");

fs.writeFileSync(
    path.resolve(__dirname, "lib", "cjs", "package.json"),
    `
{
    "type": "commonjs",
    "types": "./index.d.ts"
}
`
);
fs.writeFileSync(
    path.resolve(__dirname, "lib", "mjs", "package.json"),
    `
{
    "type": "module",
    "types": "./index.d.ts"
}
`
);
