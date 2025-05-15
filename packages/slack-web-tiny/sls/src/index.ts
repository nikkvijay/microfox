import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { sendMessage } from "./functions/sendMessage.js";

type SDKFunctionMap = {
  [key: string]: (args: any) => Promise<any>;
};

// Map function names to actual implementations
const sdkFunctionMap: SDKFunctionMap = {
  "send-message": sendMessage,
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const path = event.path?.split("/").filter(Boolean).pop(); // extract function name from path
    const sdkFunction = sdkFunctionMap[path || ""];

    if (!sdkFunction) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `No function found for path: ${path}` }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};

    const result = await sdkFunction(body);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Wrapper function error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
