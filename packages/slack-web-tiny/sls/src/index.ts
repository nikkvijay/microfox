import { createSlackSDK } from '@microfox/slack-web-tiny';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import openapi from './openapi.json';
import { loadEnvFromQuery } from './utils/env';

dotenv.config(); // for any local vars

export const handler = async (event: any): Promise<any> => {
  // Extract the functionName from the path: /{functionName}
  console.log("event", event)
  const segments = event.path.split("/").filter(Boolean);
  const functionName = segments[segments.length - 1]!.split("?")[0];
  console.log("functionName", functionName)
  if (functionName === "docs.json") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(openapi),
    };
  }

  // Read and decrypt header from query parameters instead of headers
  const encoded = event.queryStringParameters?.['client-env-variables']
  if (!encoded) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing env in query parameters' }) };
  }

  const envVars = loadEnvFromQuery(encoded);

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
