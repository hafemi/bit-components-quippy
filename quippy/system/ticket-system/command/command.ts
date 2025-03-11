import {
  APIRole,
  ChatInputCommandInteraction,
  Role
} from "discord.js";

import {
  TicketType
} from "@hafemi/quippy.system.ticket-system.database-definition";

import {
  TicketSystemLimitations
 } from "@hafemi/quippy.lib.types";

export async function handleTicketCreation({
  interaction,
  name,
  role,
  prefix,
}: {
  interaction: ChatInputCommandInteraction;
  name: string;
  role: NonNullable<Role | APIRole>;
  prefix: string;
  }): Promise<string | undefined> {
  const guildID = interaction.guildId;
  const nameLimit = TicketSystemLimitations.NameLimit
  const prefixLimit = TicketSystemLimitations.PrefixLimit
  const doesTypeExist = await TicketType.isEntry({ guildID, typeName: name });
  
  switch (true) {
    case name.length > nameLimit: return `\`Error:\` Name \`${ name } \` exceeds the limit of ${nameLimit} characters (${name.length})`;
    case prefix.length > prefixLimit: return `\`Error:\` Prefix \`${ prefix }\` exceeds the limit of ${prefixLimit} characters (${prefix.length})`;
    case doesTypeExist: return `\`Error:\` Type \`${name}\` already exists`;
  }
  
  const typeLimit = TicketSystemLimitations.Types;
  const typeAmount = await TicketType.count({ where: { guildID } });
  
  if (typeAmount == typeLimit) return `\`Error:\` Server exceeds the limit of ${typeLimit} ticket types`;
  
  await TicketType.create({
    uuid: await TicketType.createNewValidUUID(),
    guildID,
    typeName: name,
    roleID: role.id,
    prefix
  });
}