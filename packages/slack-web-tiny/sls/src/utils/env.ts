import dotenv from 'dotenv';
import { decodeBase64Url, decryptAesGcm } from './encryption';

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
