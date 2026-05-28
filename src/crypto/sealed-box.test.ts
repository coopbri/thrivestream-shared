import { beforeAll, describe, expect, it } from "bun:test";
import sodium from "libsodium-wrappers";
import { decryptToken, encryptToken, generateKey } from "./sealed-box";

beforeAll(async () => {
  await sodium.ready;
});

describe("sealed-box", () => {
  it("roundtrips a token through encrypt and decrypt", async () => {
    const key = await generateKey();
    const cipher = await encryptToken("super-secret-token", key);
    expect(cipher).not.toContain("super-secret-token");
    expect(await decryptToken(cipher, key)).toBe("super-secret-token");
  });

  it("rejects ciphertext encrypted with a different key", async () => {
    const cipher = await encryptToken("hello", await generateKey());
    await expect(decryptToken(cipher, await generateKey())).rejects.toThrow();
  });
});
