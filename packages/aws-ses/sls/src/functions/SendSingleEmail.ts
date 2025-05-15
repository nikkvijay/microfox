import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createSESSdk } from "@microfox/aws-ses";
import dotenv from "dotenv";

dotenv.config();

/**
 * Sends a single email using AWS SES
 */
export const sendSingleEmail = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Initialize AWS SES client
    const ses = createSESSdk({
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
      region: process.env.AWS_SES_REGION!,
    });

    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { sender, recipient, subject, bodyText, bodyHtml, displayName } = body;

    // Validate required fields
    if (!sender || !recipient || !subject || (!bodyText && !bodyHtml)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Missing required fields: sender, recipient, subject, and either bodyText or bodyHtml are required",
        }),
      };
    }

    // Prepare email parameters
    const emailParams = {
      sender,
      recipient,
      subject,
      bodyText,
      bodyHtml,
      displayName,
    };

    // Send email using AWS SES
    const response = await ses.sendEmail(emailParams);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Email sent successfully",
        messageId: response.SendEmailResult.MessageId,
        requestId: response.ResponseMetadata.RequestId,
      }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred while sending email",
      }),
    };
  }
};

/**
 * Documentation for sendSingleEmail endpoint
 */
export const sendSingleEmailDocs = {
  operationId: "sendSingleEmail",
  summary: "Send a single email using AWS SES",
  description: "Sends an email to a single recipient using AWS Simple Email Service",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            sender: {
              type: "string",
              format: "email",
              description: "Email address of the sender (must be verified in AWS SES)",
            },
            recipient: {
              type: "string",
              format: "email",
              description: "Email address of the recipient",
            },
            subject: {
              type: "string",
              description: "Subject line of the email",
            },
            bodyText: {
              type: "string",
              description: "Plain text version of the email body",
            },
            bodyHtml: {
              type: "string",
              description: "HTML version of the email body",
            },
            displayName: {
              type: "string",
              description: "Display name for the sender (optional)",
            },
          },
          required: ["sender", "recipient", "subject"],
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Email sent successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
              messageId: {
                type: "string",
                description: "Unique identifier for the sent email",
              },
              requestId: {
                type: "string",
                description: "Unique identifier for the AWS SES API request",
              },
            },
          },
        },
      },
    },
    "400": {
      description: "Bad request",
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
