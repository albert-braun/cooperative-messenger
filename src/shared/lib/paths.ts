export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function homePath() {
  return `${basePath}/` || "/";
}

export function appPath() {
  return `${basePath}/app`;
}
