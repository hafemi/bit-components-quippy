import {
  AttachmentBuilder,
  GuildTextBasedChannel,
  Message,
  PermissionResolvable
} from 'discord.js';

import { createAttachmentFromString } from '@cd/core.djs.attachment';
import { getMemberFromAPIGuildMember } from '@cd/core.djs.member';
import { fetchMessages } from '@cd/core.djs.message';

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

export async function hasUserPermission(interaction: any, permission: PermissionResolvable): Promise<boolean> {
  const senderUser = await getMemberFromAPIGuildMember(interaction.client, interaction.guildId!, interaction.member!);

  if (!senderUser.permissions.has(permission)) {
    return false;
  }

  return true;
}

export async function fetchMessagesFromChannel(channel: GuildTextBasedChannel, amount: number): Promise<AttachmentBuilder> {
  const fetchedMessages = await fetchMessages(channel, amount);

  const messageData = fetchedMessages.reverse().map(msg =>
    `${msg.author.displayName} (${msg.createdAt.toLocaleString()}): \n${msg.content}`
  ).join('\n \n');

  return createAttachmentFromString(messageData, `${channel.name}-messages.txt`);
}