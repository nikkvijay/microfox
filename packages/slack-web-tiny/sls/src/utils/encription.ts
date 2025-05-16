import crypto from 'crypto';

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