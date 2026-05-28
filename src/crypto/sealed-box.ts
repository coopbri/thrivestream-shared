import sodium from "libsodium-wrappers";

export async function generateKey(): Promise<string> {
  await sodium.ready;
  return sodium.to_base64(sodium.crypto_secretbox_keygen());
}

export async function encryptToken(plaintext: string, keyBase64: string): Promise<string> {
  await sodium.ready;
  const key = sodium.from_base64(keyBase64);
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const cipher = sodium.crypto_secretbox_easy(plaintext, nonce, key);
  const combined = new Uint8Array(nonce.length + cipher.length);
  combined.set(nonce);
  combined.set(cipher, nonce.length);
  return sodium.to_base64(combined);
}

export async function decryptToken(combinedBase64: string, keyBase64: string): Promise<string> {
  await sodium.ready;
  const key = sodium.from_base64(keyBase64);
  const combined = sodium.from_base64(combinedBase64);
  const nonce = combined.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  const cipher = combined.slice(sodium.crypto_secretbox_NONCEBYTES);
  const plain = sodium.crypto_secretbox_open_easy(cipher, nonce, key);
  if (!plain) throw new Error("decryptToken: authentication failed");
  return sodium.to_string(plain);
}
