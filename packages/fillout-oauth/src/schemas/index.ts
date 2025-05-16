import { z } from 'zod';

export const filloutOAuthConfigSchema = z.object({
  clientId: z.string().describe('The client ID for your Fillout application'),
  clientSecret: z.string().describe('The client secret for your Fillout application'),
  redirectUri: z.string().url().describe('The redirect URI for your Fillout application'),
});

export const accessTokenResponseSchema = z.object({
  access_token: z.string().describe('The access token for authenticating API requests'),
  base_url: z.string().url().describe('The base URL for the Fillout API'),
});

export const authorizationCodeParamsSchema = z.object({
  code: z.string().describe('The authorization code received from the authorization endpoint'),
});

export const tokenRequestParamsSchema = z.object({
  code: z.string().describe('The authorization code received from the authorization endpoint'),
  client_id: z.string().describe('The client ID for your Fillout application'),
  client_secret: z.string().describe('The client secret for your Fillout application'),
  redirect_uri: z.string().url().describe('The redirect URI for your Fillout application'),
});
