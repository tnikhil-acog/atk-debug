
const filePath = "/Users/nikhil/projects/atk-debug/examples/01-basic-usage.ts";
const line = 21;

console.log("Standard basename:");
console.log(`[01-basic-usage.ts:${line}] message`);

console.log("\nAbsolute path:");
console.log(`[${filePath}:${line}] message`);

console.log("\nRelative path:");
console.log(`[examples/01-basic-usage.ts:${line}] message`);

console.log("\nFile URI:");
console.log(`[file://${filePath}:${line}] message`);

console.log("\nOSC 8 Hyperlink (if supported):");
const osc8 = (url, text) => `\u001b]8;;${url}\u001b\\${text}\u001b]8;;\u001b\\`;
console.log(`[${osc8(`file://${filePath}`, `01-basic-usage.ts:${line}`)}] message`);
