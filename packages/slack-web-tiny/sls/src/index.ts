import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendMessage } from './functions/sendMessage';
import { sendMessageDocs } from './functions/sendMessage';

// Map function names to handlers and docs
const handlers: Record<string, (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>> = {
  sendMessage,
};

const docsMap: Record<string, any> = {
  'send-message': sendMessageDocs,
};

// Build OpenAPI spec dynamically
const apiDocs = {
  openapi: '3.0.1',
  info: {
    title: 'Slack API Integration',
    version: '1.0.0',
    description: 'API for handling slack messages',
    contact: { name: 'API Support', email: 'support@microfox.com' },
  },
  servers: [{ url: `https://api.microfox.com/c/2121b4fc-e905-4d75-8ec9-b3bb8088285e`, description: 'Production server' }],
  paths: Object.fromEntries(
    Object.entries(docsMap).map(([path, doc]) => [`/${path}`, { post: doc }])
  ),
};

export const wrapperHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { path, httpMethod } = event;

  // Serve docs
  if (path === '/docs.json' && httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(apiDocs, null, 2),
    };
  }

  // Execute function
  if (path.startsWith('/execute') && httpMethod === 'POST') {
    const pathParts = path.split('/');
    const functionName = pathParts[1];
    console.log(functionName);
    const handler = handlers[functionName];
    if (!handler) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Unknown function' }) };
    }
    return handler(event);
  }

  return { statusCode: 404, body: 'Not found' };
};