// Host-only read adapter. Existing Dema modules retain their semantics and ownership.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export async function readDemaOwners({ demaRoot, demaHome }) {
  const load = (path) => import(pathToFileURL(resolve(demaRoot, path)).href);
  const { readVerifiedRootCanon } = await load("apps/cli/src/commands/identity-root-gatherer.js");
  const roots = await readVerifiedRootCanon();
  if (!roots.ok) return { roots: { ok: false, report: roots.root_canon, error: roots.error } };
  const { buildDailyReturnSituation } = await load("apps/cli/src/daily-return-situation.js");
  const { buildUrpSharedRuntimeDiscovery } = await load("packages/core/src/urp-shared-runtime-discovery.js");
  const daily = await buildDailyReturnSituation({ demaHome, cwd: demaRoot });
  const discovery = buildUrpSharedRuntimeDiscovery();
  return {
    roots: { ok: roots.ok, report: roots.root_canon, error: roots.error },
    // Never export the private season store or turn history.
    return_situation: daily.situation,
    shared_urp: {
      schema: discovery.schema,
      mode: discovery.mode,
      truth_label: discovery.truth_label,
      status: discovery.status,
      blocked_capabilities: discovery.blocked_capabilities,
      boundary: discovery.boundary,
    },
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const [, , demaRoot, demaHome] = process.argv;
    if (!demaRoot || !demaHome) throw new Error("explicit Dema root and home required");
    console.log(JSON.stringify(await readDemaOwners({ demaRoot, demaHome })));
  } catch {
    console.log(JSON.stringify({ error: "dema_owner_read_failed" }));
    process.exitCode = 3;
  }
}
