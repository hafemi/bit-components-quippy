import {
  APIRole,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Role
} from "discord.js";

import { TicketType } from "@hafemi/quippy.system.ticket-system.database-definition";

import { TicketSystemLimitations } from "@hafemi/quippy.lib.types";
 
import { ticketSystemEmbedColor } from "@hafemi/quippy.lib.constants";

export async function handleTicketTypeCreation({
  name,
  role,
  prefix,
  guildID
}: {
  name: string;
  role: NonNullable<Role | APIRole>;
  prefix: string;
  guildID: string;
  }): Promise<string | undefined> {
  const areNotValid = await validateTicketTypeArguments({ name, prefix, guildID });
  if (areNotValid) return areNotValid;
  
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
  return undefined;
}

export async function getTicketTypesEmbed(guildID: string): Promise<EmbedBuilder | undefined> {
  const ticketTypes = await TicketType.findAll({ where: { guildID } });
  if (ticketTypes.length == 0) return undefined;
  
  const nameFieldValue = ticketTypes.map(type => type.typeName);
  const roleFieldValue = ticketTypes.map(type => `<@&${type.roleID}>`);
  const prefixFieldValue = ticketTypes.map(type => type.prefix);
  
  return new EmbedBuilder()
    .setTitle('Ticket Types')
    .setColor(ticketSystemEmbedColor)
    .setDescription('List of all ticket types of this server')
    .addFields(
      { name: 'Name', value: nameFieldValue.join('\n'), inline: true },
      { name: 'Role', value: roleFieldValue.join('\n'), inline: true },
      { name: 'Prefix', value: prefixFieldValue.join('\n'), inline: true }
    );
}

export async function handleTicketTypeRemoval({
  name,
  guildID
}: {
  name: string;
  guildID: string;
}): Promise<string | undefined> {
  const maybeTicketType = await TicketType.getEntry({ guildID, typeName: name });
  
  if (!maybeTicketType) return `\`Error:\` Type \`${name}\` does not exist`;
  
  await maybeTicketType.destroy();
  return undefined;
}

export async function handleTicketTypeEdit({
  oldName,
  newName,
  newRole,
  newPrefix,
  guildID
}: {
  oldName: string;
  newName?: string;
  newRole?: NonNullable<Role | APIRole>;
  newPrefix?: string;
  guildID: string;
}): Promise<string | undefined> {
  const areNotValid = await validateTicketTypeArguments({
    name: newName,
    prefix: newPrefix,
    guildID
  });
  if (areNotValid) return areNotValid
  
  const maybeTicketType = await TicketType.getEntry({ guildID, typeName: oldName });
  if (!maybeTicketType) return `\`Error:\` Type \`${oldName}\` does not exist`;
  
  await maybeTicketType.update({
    typeName: newName ?? maybeTicketType.typeName,
    roleID: newRole?.id ?? maybeTicketType.roleID,
    prefix: newPrefix ?? maybeTicketType.prefix
  })
  
  return undefined;
}

async function validateTicketTypeArguments({
  name,
  prefix,
  guildID
}: {
  name?: string;
  prefix?: string;
  guildID?: string;
}): Promise<string | undefined> {
  const nameLimit = TicketSystemLimitations.NameLimit;
  const prefixLimit = TicketSystemLimitations.PrefixLimit;
  const doesTypeExist = await TicketType.isEntry({ guildID, typeName: name });
  
  if (name && name.length > nameLimit)
    return `\`Error:\` Name \`${name} \` exceeds the limit of ${nameLimit} characters (${name.length})`;
  
  if (prefix && prefix.length > prefixLimit)
    return `\`Error:\` Prefix \`${prefix}\` exceeds the limit of ${prefixLimit} characters (${prefix.length})`;
  
  if (doesTypeExist)
    return `\`Error:\` Type \`${name}\` already exists`;
  
  return undefined;
}