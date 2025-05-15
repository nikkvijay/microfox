import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createSlackSDK } from '@microfox/slack-web-tiny';
import dotenv from "dotenv";

dotenv.config();

// Initialize the Slack SDK
const slackSDK = createSlackSDK({
  botToken: process.env.SLACK_BOT_TOKEN ?? '',
  authType: 'header',
});

/**
 * Send a message to a Slack user or channel
 * @param event - The API Gateway event
 * @returns APIGatewayProxyResult
 */
export const sendMessage = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { recipient, message } = body;

    // Validate input parameters
    if (!recipient || !message) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Missing required fields: recipient and message are required",
        }),
      };
    }

    // Send message to specified recipient (user or channel)
    const response = await slackSDK.sendMessage({
      channel: recipient,
      text: message,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Message sent successfully",
        slackResponse: response,
      }),
    };
  } catch (error) {
    console.error("Error sending Slack message:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

/**
 * Documentation for sendSlackMessage endpoint
 */
export const sendMessageDocs = {
  summary: "Send a message to a Slack user or channel",
  description: "Sends a message to a specified Slack recipient (user or channel) using the Slack API.",
  parameters: [],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            recipient: {
              type: "string",
              description: "The Slack user ID or channel ID to send the message to",
            },
            message: {
              type: "string",
              description: "The content of the message to be sent",
            },
          },
          required: ["recipient", "message"],
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Message sent successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
              slackResponse: {
                type: "object",
                description: "Response from the Slack API",
              },
            },
          },
        },
      },
    },
    "400": {
      description: "Bad request - missing required fields",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
                description: "Error message describing the missing fields",
              },
            },
          },
        },
      },
    },
    "500": {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
                description: "Error message describing what went wrong",
              },
            },
          },
        },
      },
    },
  },
};
