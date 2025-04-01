import {
  GuildTextBasedChannel,
  Message,
  PermissionResolvable
} from 'discord.js';

import { sequelize } from "@cd/core.database.sequelize.default-connection";
import { getMemberFromAPIGuildMember } from '@cd/core.djs.member';
import { QueryTypes } from "sequelize";

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

export function formatNumberWithApostrophes(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

export async function getNextAutoIncrement(modelName: string): Promise<number> {
  const tableName = sequelize.model(modelName).getTableName();
  const result = await sequelize.query(`SHOW TABLE STATUS LIKE '${tableName}'`, {
    type: QueryTypes.SELECT
  });

  return (result[0] as { Auto_increment: number; }).Auto_increment;
}