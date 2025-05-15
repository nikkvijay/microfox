import { z } from 'zod';

export const GmailSDKConfigSchema = z.object({
  accessToken: z
    .string()
    .optional()
    .describe('The access token for the Google OAuth application'),
  refreshToken: z
    .string()
    .optional()
    .describe('The refresh token for the Google OAuth application'),
  clientId: z
    .string()
    .describe('The client ID for the Google OAuth application'),
  clientSecret: z
    .string()
    .describe('The client secret for the Google OAuth application'),
  redirectUri: z
    .string()
    .url()
    .describe('The redirect URI for the Google OAuth flow'),
  scopes: z
    .array(z.string())
    .optional()
    .describe('The scopes for the Google OAuth application'),
  userId: z
    .string()
    .optional()
    .default('me')
    .describe('The user ID to use for API requests'),
});

export const LabelSchema = z.object({
  id: z.string().describe('The label ID'),
  name: z.string().describe('The display name of the label'),
  messageListVisibility: z
    .enum(['show', 'hide'])
    .optional()
    .describe('The visibility of the label in the message list'),
  labelListVisibility: z
    .enum(['labelShow', 'labelShowIfUnread', 'labelHide'])
    .optional()
    .describe('The visibility of the label in the label list'),
  type: z.enum(['system', 'user']).describe('The type of the label'),
});

export const ListLabelsResponseSchema = z.object({
  labels: z.array(LabelSchema).describe('The list of labels'),
});

export const MessageSchema = z.object({
  id: z.string().describe('The message ID'),
  threadId: z.string().describe('The ID of the thread the message belongs to'),
  labelIds: z
    .array(z.string())
    .optional()
    .describe('List of IDs of labels applied to this message'),
  snippet: z.string().describe('A short part of the message text'),
  payload: z
    .object({
      headers: z
        .array(
          z.object({
            name: z.string(),
            value: z.string(),
          }),
        )
        .describe('The email headers'),
      body: z
        .object({
          data: z
            .string()
            .optional()
            .describe('The body data of the message, in base64url encoding'),
        })
        .optional(),
    })
    .describe('The parsed email structure'),
});

export const ListMessagesResponseSchema = z.object({
  messages: z.array(MessageSchema).describe('The list of messages'),
  nextPageToken: z
    .string()
    .optional()
    .describe('Token to retrieve the next page of results'),
});

export const ThreadSchema = z.object({
  id: z.string().describe('The thread ID'),
  snippet: z.string().describe('A short part of the message text'),
  messages: z
    .array(MessageSchema)
    .optional()
    .describe('The list of messages in the thread'),
});

export const ListThreadsResponseSchema = z.object({
  threads: z.array(ThreadSchema).describe('The list of threads'),
  nextPageToken: z
    .string()
    .optional()
    .describe('Token to retrieve the next page of results'),
});
