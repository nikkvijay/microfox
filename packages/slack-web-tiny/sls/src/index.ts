// src/index.ts
import { createSlackSDK } from "@microfox/slack-web-tiny";
import dotenv from "dotenv";
dotenv.config();

type SDKFunc = (args: any) => Promise<any>;

export const handler = async (
  event: any
): Promise<any> => {
  console.log("event sdgdsgs", event);
  const slackSDK = createSlackSDK({
    botToken: process.env.SLACK_BOT_TOKEN ?? "",
    authType: "header",
  });

  const sdkMap: Record<string, SDKFunc> = {
    "sendMessage": slackSDK.sendMessage,
    "updateMessage": slackSDK.updateMessage,
    "uploadFile": slackSDK.uploadFile,
  };
  
  // Extract the functionName from the path: /execute/{functionName}
  const segments = event.path.split("/").filter(Boolean);
  const functionName = segments[segments.length - 1]!;
  const fn = sdkMap[functionName];

  if (!fn) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: `Function '${functionName}' not found` }),
    };
  }

  // Parse JSON body
  let args: any;
  try {
    args = event.body ? JSON.parse(event.body) : {};
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
    };
  }

  // Invoke the SDK function
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
