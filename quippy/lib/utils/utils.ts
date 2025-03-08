import {
  GuildTextBasedChannel,
  Message
} from 'discord.js';

export function capitalizeFirstLetter(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export async function fetchMessageById({
  channel,
  messageId
}: {
  channel: GuildTextBasedChannel;
  messageId: string;
}): Promise<Message<true> | null> {
  try {
    return await channel.messages.fetch(messageId);
  } catch {
    return null;
  }
}