import type { NodeExecutor } from "@/features/executions/types";
import { telegramChannel } from "@/inngest/channels/telegram";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { decode } from "html-entities";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const SafeString = new Handlebars.SafeString(jsonString);
  return SafeString;
});

type TelegramData = {
  variableName?: string;
  credentialId?: string;
  chatId?: string;
  text?: string;
  parseMode?: "HTML" | "Markdown" | "MarkdownV2";
};

type TelegramSendMessageResponse = {
  result: {
    chat: {
      id: number | string;
    };
    message_id: number;
  };
};

export const telegramExecutor: NodeExecutor<TelegramData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  await publish(
    telegramChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.variableName) {
    await publish(
      telegramChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Telegram node: Variable name is missing");
  }

  if (!data.credentialId) {
    await publish(
      telegramChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Telegram node: Credential is missing");
  }

  if (!data.chatId) {
    await publish(
      telegramChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Telegram node: Chat ID is missing");
  }

  if (!data.text) {
    await publish(
      telegramChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Telegram node: Message text is missing");
  }

  const variableName = data.variableName;

  const chatId = Handlebars.compile(data.chatId)(context);
  const text = decode(Handlebars.compile(data.text)(context)).slice(0, 4096);
  const parseMode = data.parseMode;

  const credential = await step.run("get-telegram-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
        userId,
      },
    });
  });

  if (!credential) {
    await publish(
      telegramChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Telegram node: Credential is missing");
  }

  const botToken = decrypt(credential.value);

  try {
    const result = await step.run("telegram-send-message", async () => {
      const response = await ky
        .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          json: {
            chat_id: chatId,
            text,
            parse_mode: parseMode,
          },
        })
        .json<TelegramSendMessageResponse>();

      return {
        ...context,
        [variableName]: {
          chatId: String(response.result.chat.id),
          messageId: response.result.message_id,
          parseMode,
          text,
        },
      };
    });

    await publish(
      telegramChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return { context: result, activeHandle: "source-1" };
  } catch (error) {
    await publish(
      telegramChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};