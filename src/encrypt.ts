import { getKey } from "./key.ts";

/** Takes in a JSON object and encrypts it for the Blooket API */
export async function encrypt(json: Record<string, unknown>) {
  const type = { name: "AES-GCM" }
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const stringified = JSON.stringify(json);
  const encoded = new TextEncoder().encode(stringified);
  const encrypted = await crypto.subtle.encrypt({ ...type, iv: iv }, key, encoded);
  const seg1 = Array.from(iv).map(e => String.fromCharCode(e)).join("");
  const seg2 = Array.from(new Uint8Array(encrypted)).map(e => String.fromCharCode(e)).join("");
  return btoa(seg1 + seg2);
}