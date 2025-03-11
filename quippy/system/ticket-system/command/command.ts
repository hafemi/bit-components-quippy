import {
  APIRole,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Role
} from "discord.js";

import { TicketType } from "@hafemi/quippy.system.ticket-system.database-definition";

import { TicketSystemLimitations } from "@hafemi/quippy.lib.types";
 
import { defaultEmbedColor } from "@hafemi/quippy.lib.constants";

export async function handleTicketTypeCreation({
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

export async function getTicketTypesEmbed(guildID: string): Promise<EmbedBuilder | undefined> {
  const ticketTypes = await TicketType.findAll({ where: { guildID } });
  if (ticketTypes.length == 0) return;
  
  const nameFieldValue = ticketTypes.map(type => type.typeName);
  const roleFieldValue = ticketTypes.map(type => `<@&${type.roleID}>`);
  const prefixFieldValue = ticketTypes.map(type => type.prefix);
  
  return new EmbedBuilder()
    .setTitle('Ticket Types')
    .setColor(defaultEmbedColor)
    .setDescription('List of all ticket types of this server')
    .addFields(
      { name: 'Name', value: nameFieldValue.join('\n'), inline: true },
      { name: 'Role', value: roleFieldValue.join('\n'), inline: true },
      { name: 'Prefix', value: prefixFieldValue.join('\n'), inline: true }
    );
}