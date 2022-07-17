"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const child_process_1 = require("child_process");
try {
    fs_1.default.rmdirSync(path_1.default.resolve(__dirname, "lib"), { recursive: true });
}
catch (_a) { }
(0, child_process_1.exec)("tsc -p tsconfig.cjs.json", (error, stdout, stderr) => {
    console.log("stdout: " + stdout);
    console.log("stderr: " + stderr);
    if (error !== null) {
        console.log("exec error: " + error);
    }
});
(0, child_process_1.exec)("tsc -p tsconfig.esm.json", (error, stdout, stderr) => {
    console.log("stdout: " + stdout);
    console.log("stderr: " + stderr);
    if (error !== null) {
        console.log("exec error: " + error);
    }
});
// fs.writeFileSync(
//     "./lib/cjs/package.json",
//     `
// {
//     "type": "commonjs"
// }
// `
// );
// fs.writeFileSync(
//     path.resolve(__dirname, "lib", "esm", "package.json"),
//     `
// {
//     "type": "module"
// }
// `
// );
