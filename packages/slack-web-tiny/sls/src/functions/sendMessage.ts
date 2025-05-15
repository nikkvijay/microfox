import { createSlackSDK } from "@microfox/slack-web-tiny";
import dotenv from "dotenv";
dotenv.config();

export const sendMessage = async ({
  recipient,
  message,
}: {
  recipient: string;
  message: string;
}) => {
  if (!recipient || !message) {
    return {
      error: "Missing required fields: recipient and message are required",
    };
  }

  const slackSDK = createSlackSDK({
    botToken: process.env.SLACK_BOT_TOKEN ?? "",
    authType: "header",
  });

  const slackResponse = await slackSDK.sendMessage({
    channel: recipient,
    text: message,
  });

  return {
    message: "Message sent successfully",
    slackResponse,
  };
};
