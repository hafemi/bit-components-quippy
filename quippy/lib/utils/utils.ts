import {
  APIInteractionGuildMember,
  ChatInputCommandInteraction,
  GuildMember,
  GuildTextBasedChannel,
  Message,
  PermissionFlagsBits,
  PermissionResolvable
} from 'discord.js';

import { getMemberFromAPIGuildMember } from '@cd/core.djs.member';

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

export async function validateUserPermission(interaction: ChatInputCommandInteraction, permission: PermissionResolvable): Promise<boolean> {
  const senderUser = await getMemberFromAPIGuildMember(interaction.client, interaction.guildId!, interaction.member!);

  if (!senderUser.permissions.has(permission)) {
    return false;
  }

  return true;
}