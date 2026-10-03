#!/usr/bin/env node
/**
 * Fail-closed review gate for the preview invoke() loop.
 * Run: node --experimental-strip-types scripts/review/invoke-loop-check.mjs [--json]
 */
import { pathToFileURL } from "node:url";
import { runInvokeLoopCheck } from "../../src/lib/dema/invoke-loop.ts";

const JSON_MODE = process.argv.includes("--json");

export function main() {
  const report = runInvokeLoopCheck();
  if (JSON_MODE) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log("BIZRA URP — invoke-loop-check");
    console.log(`  schema: ${report.schema}`);
    console.log(`  truth:  ${report.truth_label}`);
    console.log(`  result: ${report.ok ? "PASS" : "FAIL"}`);
    for (const item of report.cases) {
      console.log(`  case ${item.ok ? "PASS" : "FAIL"} ${item.name} — ${item.detail}`);
    }
    for (const line of report.consent) console.log(`  consent: ${line}`);
    for (const line of report.compliance) console.log(`  compliance: ${line}`);
    for (const line of report.self_critique) console.log(`  critique: ${line}`);
  }
  if (!report.ok) process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
