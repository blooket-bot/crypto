import { getKey } from "./key.ts";

/** Decrypts an already encrypted string from the Blooket API */
export async function decrypt(encrypted: string) {
  const type = { name: "AES-GCM" }
  const key = await getKey();
  const textBytes = atob(encrypted);
  const iv = textBytes.substring(0, 12).split("").map(e => e.charCodeAt(0));
  const encryptedData = textBytes.substring(12).split("").map(e => e.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt({ ...type, iv: new Uint8Array(iv).buffer }, key, new Uint8Array(encryptedData));
  const decoded = new TextDecoder().decode(decrypted);
  return JSON.parse(decoded);
}