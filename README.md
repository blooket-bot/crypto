# Blooket Crypto
A collection of tools for managing Blooket's crypto keys and builds.

## Example ([getKeys.ts](./examples/getKeys.ts))
```ts
import * as crypto from "../mod.ts";

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
```

## Output from Example
```ts
Blooket Build Updated! 95c5cbd0-e804-420c-a19a-9c6331b84e66 zNPBVphuzygUMiVHfhmpcR1PcMoouAQH
Build ID => 95c5cbd0-e804-420c-a19a-9c6331b84e66 Key => zNPBVphuzygUMiVHfhmpcR1PcMoouAQH
Crypto Key => CryptoKey {
  type: "secret",
  extractable: true,
  algorithm: { name: "AES-GCM", length: 256 },
  usages: [ "encrypt", "decrypt" ]
}
Encrypted => 22YHIqvCoBde7BhReau1kttyEqqz5+1p5g9wllW9j+DJpS5r7eekrwc=
Decrypted => { foo: "bar" }
```
> Output may vary depending on the build and key at the time of fetching them.