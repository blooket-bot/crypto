import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";

const buildRgx = /i.{1,3}"([a-f]|[0-9]|-){1,36}"/g;
const keyRgx = /encode\("([A-z]|[0-9]){32}"/g;
let blooketKey: string | undefined;
let blooketBuild: string | undefined;
// deno-lint-ignore ban-types
let updateFunc: Function | undefined;

/**
 * Gets the imported build key ready for encryption
 */
export async function getKey(): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(blooketKey)),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}

/** Gets the last fetched raw key */
export function getRawKey(): string | undefined {
  return blooketKey;
}

/** Gets the last fetched build ID */
export function getBuild(): string | undefined {
  return blooketBuild;
}

async function getScripts(): Promise<string[] | undefined> {
  let source: string | null = null;
  try {
    source = (await axiod.get("https://dashboard.blooket.com/index.html")).data;
  }catch {
    return;
  }
  if(!source) return;
  
  const mainScripts: string[] = [];
  const unparsedScripts = source.split("src=\"/main");
  unparsedScripts.shift();
  for(const script of unparsedScripts) {
    mainScripts.push(`https://dashboard.blooket.com/main${script.split(`"`)[0]}`);
  }
  return mainScripts;
}

/** Fetchs the latest build ID and key */
export async function refreshKeys(): Promise<boolean> {
  const scripts = await getScripts();
  if(!scripts) return false;

  for(const script of scripts) {
    const text = await(await fetch(script)).text().catch(() => {}) || "";
    if(!buildRgx.test(text)) continue;
    const build = text.match(buildRgx)?.[0].split('"')[1];
    const key = text.match(keyRgx)?.[0].split('"')[1];
    if((build !== blooketBuild || key !== blooketKey) && updateFunc) {
      updateFunc(build, key);
    }
    blooketBuild = build;
    blooketKey = key;
    break;
  }
  return true;
}

/** Sets up a function to be called when the build ID or crypto key changes */
// deno-lint-ignore ban-types
export function onUpdate(func: Function) {
  updateFunc = func;
}