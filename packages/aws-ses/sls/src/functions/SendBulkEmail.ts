import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createSESSdk } from "@microfox/aws-ses";
import dotenv from "dotenv";

dotenv.config();

// Initialize AWS SES client
const ses = createSESSdk({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  region: process.env.AWS_SES_REGION!,
});

/**
 * Sends bulk emails using AWS SES
 */
export const sendBulkEmail = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { sender, recipients, subject, bodyText, bodyHtml } = body;

    // Validate required fields
    if (!sender || !recipients || !Array.isArray(recipients) || recipients.length === 0 || !subject) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Missing required fields: sender, recipients (array), and subject are required",
        }),
      };
    }

    // Prepare email parameters
    const emailParams = {
      sender,
      recipients,
      subject,
      bodyText,
      bodyHtml,
    };

    // Send bulk emails
    const results = await ses.sendBulkEmails(emailParams);

    // Aggregate results
    const summary = {
      totalSent: results.length,
      successful: results.filter((result) => result.SendEmailResult?.MessageId).length,
      failed: results.filter((result) => !result.SendEmailResult?.MessageId).length,
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Bulk email sending completed",
        summary,
        results,
      }),
    };
  } catch (error) {
    console.error("Error processing bulk email request:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred while sending bulk emails",
      }),
    };
  }
};

/**
 * Documentation for the sendBulkEmail function
 */
export const sendBulkEmailDocs = {
  instructions: `
This is a POST endpoint that sends bulk emails using AWS SES.
To use this endpoint, make a POST request to /send-bulk-email with the required parameters in the request body.
  `,
  operationId: "sendBulkEmail",
  summary: "Send bulk emails using AWS SES",
  description: "Sends multiple emails to a list of recipients using AWS SES",
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
            recipients: {
              type: "array",
              items: {
                type: "string",
                format: "email",
              },
              description: "List of recipient email addresses",
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
          },
          required: ["sender", "recipients", "subject"],
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Successfully sent bulk emails",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Status message",
              },
              summary: {
                type: "object",
                properties: {
                  totalSent: {
                    type: "integer",
                    description: "Total number of emails sent",
                  },
                  successful: {
                    type: "integer",
                    description: "Number of successfully sent emails",
                  },
                  failed: {
                    type: "integer",
                    description: "Number of failed email sends",
                  },
                },
              },
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    SendEmailResult: {
                      type: "object",
                      properties: {
                        MessageId: {
                          type: "string",
                          description: "Unique identifier for the sent email",
                        },
                      },
                    },
                    ResponseMetadata: {
                      type: "object",
                      properties: {
                        RequestId: {
                          type: "string",
                          description: "Unique request identifier",
                        },
                      },
                    },
                  },
                },
                description: "Detailed results for each email sent",
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