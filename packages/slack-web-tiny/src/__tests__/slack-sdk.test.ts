import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import {
  createSlackSDK,
  BlockText,
  SlackMessage,
  UpdateMessage,
  FileUpload,
} from '../slack-sdk';
import { z } from 'zod';

// Spy on console.error to prevent showing errors during tests
const originalConsoleError = console.error;
console.error = vi.fn();

describe('Slack SDK Validation and Error Handling', () => {
  // Mock configuration
  const mockConfig: any = {
    botToken: 'xoxb-test-token-12345',
    baseUrl: 'https://slack.com/api',
    authType: 'header',
  };

  // Test data with all required fields
  const mockMessage: SlackMessage = {
    channel: 'C12345678',
    text: 'Hello, world!',
    blocks: [
      {
        type: 'section',
        text: { type: 'plain_text', text: 'Hello, world!' },
        accessory: {
          type: 'button',
          text: { type: 'plain_text', text: 'Click me' },
          action_id: 'click_me',
          url: 'https://example.com',
        },
      },
    ],
  };

  const mockUpdateMessage: UpdateMessage = {
    channel: 'C12345678',
    ts: '1234567890.123456',
    text: 'Updated message',
  };

  const mockFileUpload: FileUpload = {
    channels: 'C12345678',
    content: 'File content',
    filename: 'test.txt',
    title: 'Test File',
  };

  let slackSDK: ReturnType<typeof createSlackSDK>;

  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Create a new SDK instance for each test
    slackSDK = createSlackSDK(mockConfig);
  });

  afterAll(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });

  describe('SDK Initialization Validation', () => {
    it('should throw error with empty token', () => {
      // This should now throw a Zod validation error because we're using the schema
      expect(() =>
        createSlackSDK({
          botToken: '',
          baseUrl: 'https://slack.com/api',
          authType: 'header',
        }),
      ).toThrow(/Bot token cannot be empty/);
    });

    it('should initialize with minimal valid config', () => {
      const sdk = createSlackSDK({
        botToken: 'xoxb-valid-token',
        baseUrl: 'https://slack.com/api',
        authType: 'header',
      });
      expect(sdk).toBeDefined();
      expect(typeof sdk.sendMessage).toBe('function');
    });

    it('should reject invalid baseUrl', () => {
      expect(() =>
        createSlackSDK({
          botToken: 'xoxb-valid-token',
          baseUrl: 'invalid-url',
          authType: 'header',
        }),
      ).toThrow(/baseUrl/);
    });
  });

  describe('sendMessage Validation', () => {
    it('should reject messages missing required channel field', async () => {
      const invalidMessage = { text: 'No channel specified' } as SlackMessage;

      await expect(slackSDK.sendMessage(invalidMessage)).rejects.toThrow(
        /required/i,
      );
    });

    it('should reject messages missing required text field', async () => {
      const invalidMessage = { channel: 'C12345678' } as SlackMessage;

      await expect(slackSDK.sendMessage(invalidMessage)).rejects.toThrow(
        /required/i,
      );
    });

    // it('should handle API errors gracefully with custom error message', async () => {
    //   // For this test, we'll use a complete valid message to ensure it passes validation
    //   // but fails at the API call stage
    //   await expect(slackSDK.sendMessage(mockMessage)).rejects.toThrow(
    //     'Failed to send Slack message: API Error: Invalid token',
    //   );
    // });
  });

  describe('updateMessage Validation', () => {
    it('should reject updates missing required channel field', async () => {
      const invalidUpdate = {
        ts: '1234567890.123456',
        text: 'No channel specified',
      } as UpdateMessage;

      await expect(slackSDK.updateMessage(invalidUpdate)).rejects.toThrow(
        /required/i,
      );
    });

    it('should reject updates missing required ts field', async () => {
      const invalidUpdate = {
        channel: 'C12345678',
        text: 'No timestamp specified',
      } as UpdateMessage;

      await expect(slackSDK.updateMessage(invalidUpdate)).rejects.toThrow(
        /required/i,
      );
    });

    // it('should handle API errors gracefully with custom error message', async () => {
    //   await expect(slackSDK.updateMessage(mockUpdateMessage)).rejects.toThrow(
    //     'Failed to update Slack message: API Error: Invalid token',
    //   );
    // });
  });

  // describe('uploadFile Validation', () => {
  //   it('should handle API errors gracefully with custom error message', async () => {
  //     await expect(slackSDK.uploadFile(mockFileUpload)).rejects.toThrow(
  //       'Failed to upload file to Slack: API Error: Invalid token',
  //     );
  //   });

  //   it('should properly format FormData from file upload parameters', async () => {
  //     try {
  //       await slackSDK.uploadFile(mockFileUpload);
  //     } catch (err) {
  //       // Expected to throw, but we just want to check FormData creation
  //     }

  //     const { createRestSDK } = restSdkModule;
  //     const mockPost = createRestSDK().post;

  //     // Verify post was called with FormData
  //     expect(mockPost).toHaveBeenCalled();
  //     expect(mockPost.mock.calls[0][0]).toBe('files.upload');
  //     expect(mockPost.mock.calls[0][1] instanceof FormData).toBe(true);
  //   });
  // });

  describe('Block Kit Schema Validation', () => {
    it('should validate block text types', () => {
      // Valid text types
      expect(() => slackSDK.blocks.text('Hello', 'plain_text')).not.toThrow();
      expect(() => slackSDK.blocks.text('Hello', 'mrkdwn')).not.toThrow();

      // Invalid text type would be caught at compile time due to TypeScript
    });

    it('should validate button parameters', () => {
      // Valid button
      expect(() =>
        slackSDK.blocks.button('Click me', 'action_id'),
      ).not.toThrow();

      // Valid button with style
      expect(() =>
        slackSDK.blocks.button('Danger', 'action_id', {
          style: 'danger',
        }),
      ).not.toThrow();

      // Invalid style would be caught at compile time
    });

    it('should validate section block parameters', () => {
      // Valid section with string
      expect(() => slackSDK.blocks.section('Text')).not.toThrow();

      // Valid section with BlockText
      const textObj: BlockText = { type: 'plain_text', text: 'Hello' };
      expect(() => slackSDK.blocks.section(textObj)).not.toThrow();

      // Valid section with fields
      const fields: BlockText[] = [
        { type: 'plain_text', text: 'Field 1' },
        { type: 'plain_text', text: 'Field 2' },
      ];
      expect(() => slackSDK.blocks.section('Text', fields)).not.toThrow();
    });
  });
});
