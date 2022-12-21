import * as crypto from "https://raw.githubusercontent.com/blooket-bot/crypto/master/mod.ts";

// Set the update function
const onUpdate = (build: string | undefined, key: string | undefined) => console.log("Blooket Build Updated!", build, key);
crypto.onUpdate(onUpdate);

// Refresh the build and key
const success = await crypto.refreshKeys();
if(!success) console.log("Failed to refresh keys.");

// Get the build id and raw key
const buildId = crypto.getBuild();
const key = crypto.getRawKey();
console.log("Build ID =>", buildId, "Key =>", key);

// Get the imported key ready to use for encryption/decryption
const cryptoKey = await crypto.getKey();
console.log("Crypto Key =>", cryptoKey);

// Encrypt some JSON data
const encrypted = await crypto.encrypt({
  foo: "bar"
});
console.log("Encrypted =>", encrypted);
// Decrypt some data
const decrypted = await crypto.decrypt(encrypted);
console.log("Decrypted =>", decrypted);