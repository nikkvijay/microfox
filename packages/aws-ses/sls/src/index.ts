// Re-export external API functions
export { sendSingleEmail, sendSingleEmailDocs } from "./functions/sendSingleEmail.js";
export { sendBulkEmail, sendBulkEmailDocs } from "./functions/sendBulkEmail.js";
/**
 * Complete API documentation
 * Write down this apiDocs on the basis of open api 3.0.1 in JSON format
 * The required subdocuments for endpoints can be imported from above imports
 */
const apiDocs = {
    openapi: "3.0.1",
    info: {
        title: "SES API Integration",
        version: "1.0.0",
        description: "API for sending emails",
        contact: {
            name: "API Support",
            email: "support@microfox.com",
        },
    },
    servers: [
        {
            url: "https://api.microfox.com/c/2121b4fc-e905-4d75-8ec9-b3bb8088285e",
            description: "Production server",
        },
    ],
    paths: {
        "/send-single-email": {
            post: sendSingleEmailDocs,
        },
        "/send-bulk-email": {
            post: sendBulkEmailDocs,
        },
        "/docs.json": {
            get: getDocs,
        },
    },
};
/**
 * GET endpoint to serve API documentation
 * This Lambda function returns the complete API documentation in JSON format
 */
export const getDocs = async (event) => {
    try {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(apiDocs, null, 2),
        };
    }
    catch (error) {
        console.error("Error serving docs:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
            }),
        };
    }
};
