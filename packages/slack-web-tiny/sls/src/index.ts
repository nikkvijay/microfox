import { createSlackSDK } from '@microfox/slack-web-tiny';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config(); // for any local vars

// Ensure same ENCRYPTION_KEY is set locally
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY missing');
const KEY = Buffer.from(ENCRYPTION_KEY, 'base64');

export const handler = async (event: any): Promise<any> => {
  console.log("event sdfsf", event)

  // Extract the functionName from the path: /{functionName}
  const segments = event.path.split("/").filter(Boolean);
  const functionName = segments[segments.length - 1]!;
  console.log("functionName", functionName)

  if (functionName === "openapi.json") {
    const openapi = JSON.parse(fs.readFileSync("../openapi.json", "utf8"));
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(openapi),
    };
  }

  // Read and decrypt header
  // const encoded = event.headers['client-env-variables'] || event.headers['Client-Env-Variables'];
  // if (!encoded) {
  //   return { statusCode: 400, body: JSON.stringify({ error: 'Missing env header' }) };
  // }

  // Read and decrypt header from query parameters instead of headers
  const encoded = event.queryStringParameters?.['client-env-variables']
  if (!encoded) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing env in query parameters' }) };
  }

  const data = Buffer.from(encoded, 'base64');
  const iv = data.slice(0, 12);
  const authTag = data.slice(12, 28);
  const ciphertext = data.slice(28);

  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  const envVars: Record<string, string> = JSON.parse(decrypted.toString('utf8'));

  // Initialize Slack SDK with decrypted token
  const slackSDK = createSlackSDK({
    botToken: envVars['SLACK_BOT_TOKEN'] ?? '',
    authType: 'header',
  });

  // Map functions
  const sdkMap: Record<string, Function> = {
    sendMessage: slackSDK.sendMessage,
    updateMessage: slackSDK.updateMessage,
    uploadFile: slackSDK.uploadFile,
  };

  const fn = sdkMap[functionName];

  if (!fn) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: `Function '${functionName}' not found` }),
    };
  }

  // Parse JSON body
  let args: any = {};
  try {
    args = event.body ? JSON.parse(event.body) : {};
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
    };
  }

  // Invoke
  try {
    const result = await fn(args);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("Error executing SDK function:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
    };
  }
};
