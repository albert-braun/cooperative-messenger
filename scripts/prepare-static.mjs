import { existsSync, mkdirSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const skip = path.join(root, ".static-skip");
const api = path.join(root, "src/app/api");
const middleware = path.join(root, "src/middleware.ts");
const skippedApi = path.join(skip, "api");
const skippedMiddleware = path.join(skip, "middleware.ts");

function prepare() {
  mkdirSync(skip, { recursive: true });
  if (existsSync(api)) renameSync(api, skippedApi);
  if (existsSync(middleware)) renameSync(middleware, skippedMiddleware);
}

function restore() {
  if (existsSync(skippedApi) && !existsSync(api)) renameSync(skippedApi, api);
  if (existsSync(skippedMiddleware) && !existsSync(middleware)) {
    renameSync(skippedMiddleware, middleware);
  }
}

prepare();
try {
  const nextBin = path.join(root, "node_modules/next/dist/bin/next");
  const result = spawnSync(process.execPath, [nextBin, "build"], {
    stdio: "inherit",
    env: process.env,
    cwd: root,
  });
  process.exit(result.status ?? 1);
} finally {
  restore();
}
