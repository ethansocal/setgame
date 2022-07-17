import fs from "fs";
import path from "path";
import { exec } from "child_process";

try {
    fs.rmSync(path.resolve(__dirname, "lib"), { recursive: true });
} catch {}
exec("tsc -p tsconfig.cjs.json", (error, stdout, stderr) => {
    console.log("stdout: " + stdout);
    console.log("stderr: " + stderr);
    if (error !== null) {
        console.log("exec error: " + error);
    }
});
exec("tsc -p tsconfig.esm.json", (error, stdout, stderr) => {
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
