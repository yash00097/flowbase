"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { CredentialType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import { telegramChannel } from "@/inngest/channels/telegram";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import ky from "ky";
import { headers } from "next/headers";

export type TelegramToken = Realtime.Token<typeof telegramChannel, ["status"]>;

export async function fetchTelegramRealtimeToken(): Promise<TelegramToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: telegramChannel(),
    topics: ["status"],
  });

  return token;
}

type TelegramApiChat = {
  id: number | string;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TelegramApiUpdate = {
  message?: {
    chat?: TelegramApiChat;
  };
  edited_message?: {
    chat?: TelegramApiChat;
  };
  channel_post?: {
    chat?: TelegramApiChat;
  };
  edited_channel_post?: {
    chat?: TelegramApiChat;
  };
  my_chat_member?: {
    chat?: TelegramApiChat;
  };
  chat_member?: {
    chat?: TelegramApiChat;
  };
  callback_query?: {
    message?: {
      chat?: TelegramApiChat;
    };
  };
};

type TelegramGetUpdatesResponse = {
  ok: boolean;
  description?: string;
  result: TelegramApiUpdate[];
};

export type TelegramChat = {
  chatId: string;
  name: string;
  type: string;
};

const getChatFromUpdate = (update: TelegramApiUpdate): TelegramApiChat | null => {
  return (
    update.message?.chat ??
    update.edited_message?.chat ??
    update.channel_post?.chat ??
    update.edited_channel_post?.chat ??
    update.my_chat_member?.chat ??
    update.chat_member?.chat ??
    update.callback_query?.message?.chat ??
    null
  );
};

const getChatDisplayName = (chat: TelegramApiChat): string => {
  if (chat.title && chat.title.trim().length > 0) {
    return chat.title;
  }

  if (chat.username && chat.username.trim().length > 0) {
    return `@${chat.username}`;
  }

  const fullName = [chat.first_name, chat.last_name].filter(Boolean).join(" ").trim();

  return fullName.length > 0 ? fullName : String(chat.id);
};

export async function fetchTelegramChats(credentialId: string): Promise<TelegramChat[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const credential = await prisma.credential.findFirst({
    where: {
      id: credentialId,
      userId: session.user.id,
      type: CredentialType.TELEGRAM,
    },
    select: {
      value: true,
    },
  });

  if (!credential) {
    throw new Error("Telegram credential not found");
  }

  const botToken = decrypt(credential.value);
  const updates = await ky
    .get(`https://api.telegram.org/bot${botToken}/getUpdates`)
    .json<TelegramGetUpdatesResponse>();

  if (!updates.ok) {
    throw new Error(updates.description ?? "Failed to fetch Telegram updates");
  }

  const chats = new Map<string, TelegramChat>();

  for (const update of updates.result) {
    const chat = getChatFromUpdate(update);

    if (!chat) {
      continue;
    }

    const chatId = String(chat.id);
    if (chats.has(chatId)) {
      continue;
    }

    chats.set(chatId, {
      chatId,
      name: getChatDisplayName(chat),
      type: chat.type,
    });
  }

  return Array.from(chats.values());
}