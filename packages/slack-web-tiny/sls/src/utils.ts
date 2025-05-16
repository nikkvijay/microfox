import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const RAW_KEY = process.env.ENCRYPTION_KEY;
if (!RAW_KEY) {
    throw new Error('Missing ENCRYPTION_KEY in environment');
}
const KEY = Buffer.from(RAW_KEY, 'base64');

/**
 * Load and decrypt the client-env-variables query parameter
 */
export function loadEnvFromQuery(encoded: string): Record<string, string> {
    const data = decodeBase64Url(encoded);
    const decrypted = decryptAesGcm(data, KEY);
    return JSON.parse(decrypted.toString('utf8'));
}

/**
 * Decode a URL-safe Base64 string to a Buffer
 */
export function decodeBase64Url(input: string): Buffer {
    // replace URL-safe characters
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const mod4 = base64.length % 4;
    if (mod4 > 0) base64 += '='.repeat(4 - mod4);
    return Buffer.from(base64, 'base64');
}

/**
 * Decrypt AES-256-GCM payload, where input buffer = iv(12) | authTag(16) | ciphertext
 */
export function decryptAesGcm(buffer: Buffer, key: Buffer): Buffer {
    const iv = buffer.slice(0, 12);
    const authTag = buffer.slice(12, 28);
    const ciphertext = buffer.slice(28);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext;
}
