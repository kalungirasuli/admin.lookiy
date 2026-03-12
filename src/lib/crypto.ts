/**
 * TRAVO Web Admin Sodium Crypto
 * ===============================
 * Client-side encryption for the Next.js admin dashboard using
 * libsodium-wrappers (WASM, runs natively in browsers).
 *
 * Same protocol as the mobile app but using the libsodium API directly.
 */

import sodium from 'libsodium-wrappers';

export interface EncryptedPayload {
  nonce: string;
  ciphertext: string;
}

let _ready = false;
let _serverPublicKey: Uint8Array | null = null;
let _clientKeyPair: { publicKey: Uint8Array; privateKey: Uint8Array } | null = null;

async function ensureReady() {
  if (!_ready) {
    await sodium.ready;
    _ready = true;
  }
}

export async function initCrypto(apiBaseUrl: string): Promise<boolean> {
  try {
    await ensureReady();
    _clientKeyPair = sodium.crypto_box_keypair();

    const res = await fetch(`${apiBaseUrl}/crypto/public-key`);
    const json = await res.json();
    if (json.success && json.data?.publicKey) {
      _serverPublicKey = sodium.from_base64(json.data.publicKey, sodium.base64_variants.ORIGINAL);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('[Crypto] Init failed:', err);
    return false;
  }
}

export function isCryptoReady(): boolean {
  return _serverPublicKey !== null && _clientKeyPair !== null;
}

export function getClientPublicKey(): string {
  if (!_clientKeyPair) throw new Error('Crypto not initialised');
  return sodium.to_base64(_clientKeyPair.publicKey, sodium.base64_variants.ORIGINAL);
}

export function encrypt(plaintext: string): EncryptedPayload {
  if (!_serverPublicKey || !_clientKeyPair) throw new Error('Crypto not initialised');

  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const ciphertext = sodium.crypto_box_easy(
    sodium.from_string(plaintext),
    nonce,
    _serverPublicKey,
    _clientKeyPair.privateKey,
  );
  return {
    nonce: sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL),
    ciphertext: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
  };
}

export function decrypt(payload: EncryptedPayload): string {
  if (!_serverPublicKey || !_clientKeyPair) throw new Error('Crypto not initialised');

  const decrypted = sodium.crypto_box_open_easy(
    sodium.from_base64(payload.ciphertext, sodium.base64_variants.ORIGINAL),
    sodium.from_base64(payload.nonce, sodium.base64_variants.ORIGINAL),
    _serverPublicKey,
    _clientKeyPair.privateKey,
  );
  return sodium.to_string(decrypted);
}

export function isEncryptedPayload(body: unknown): body is EncryptedPayload {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as any).nonce === 'string' &&
    typeof (body as any).ciphertext === 'string'
  );
}
