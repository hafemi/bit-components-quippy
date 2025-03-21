import {
  ActionRowBuilder,
  APIRole,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  GuildMember,
  MessageFlags,
  Role,
  TextChannel,
  ThreadAutoArchiveDuration
} from "discord.js";

import {
  addInteraction
} from '@cd/core.djs.event.interaction-create';

import { Ticket, TicketType } from "@hafemi/quippy.system.ticket-system.database-definition";

import { getMemberFromAPIGuildMember } from '@cd/core.djs.member';
import { getRole } from '@cd/core.djs.role';
import {
  TicketSystemButtonCreateTicketPayload,
  TicketSystemIDs,
  TicketSystemLimitations
} from "@hafemi/quippy.lib.types";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

import { ticketSystemEmbedColor } from "@hafemi/quippy.lib.constants";
import { capitalizeFirstLetter } from "@hafemi/quippy.lib.utils";

export function registerTicketSystemComponents(): void {
  addInteraction(TicketSystemIDs.CreationButton, async (interaction: ButtonInteraction) => await executeButtonCreateTicket(interaction));
}

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
  const maybeResponse = await validateTicketTypeCreation({ name, guildID });
  if (maybeResponse) return maybeResponse;

  await TicketType.create({
    uuid: await TicketType.createNewValidUUID(),
    guildID,
    typeName: name,
    roleID: role.id,
    prefix
  });

  return undefined;
}

async function validateTicketTypeCreation({
  name,
  guildID
}: {
  name: string;
  guildID: string;
}): Promise<string | undefined> {
  const doesTypeExist = await TicketType.isEntry({ guildID, typeName: name });
  if (doesTypeExist) return `\`Error:\` Type \`${name}\` already exists`;

  const typeLimit = TicketSystemLimitations.DifferentTypes;
  const typeAmount = await TicketType.count({ where: { guildID } });
  if (typeAmount == typeLimit) return `\`Error:\` Server exceeds the limit of ${typeLimit} ticket types`;
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
  
  // disabled since to this day you can't delete/close a ticket
  // const randomEntry = await Ticket.findOne({
  //   where: {
  //     guildID,how wou
  //     type: name,
  //     status: 'open'
  //   }
  // })
  //if (randomEntry) return `\`Error:\` You can't remove a type with open tickets`;

  await maybeTicketType.destroy();
  await Ticket.update({ status: 'deleted' }, { where: { guildID, type: name } });
  return undefined;
}

export async function handleTicketTypeEdit({
  type,
  newRole,
  newPrefix,
  guildID,
}: {
  type: string;
  newRole?: NonNullable<Role | APIRole>;
  newPrefix?: string;
  guildID: string;
}): Promise<string | undefined> {
  if (!newRole && !newPrefix) return `\`Info:\` No new role or prefix provided`;

  const maybeTicketType = await TicketType.getEntry({ guildID, typeName: type });
  if (!maybeTicketType) return `\`Error:\` Type \`${type}\` does not exist`;

  await maybeTicketType.update({
    roleID: newRole?.id ?? maybeTicketType.roleID,
    prefix: newPrefix ?? maybeTicketType.prefix
  });

  return undefined;
}

export async function handleButtonCreateTicket(options: TicketSystemButtonCreateTicketPayload): Promise<string | undefined> {
  const areNotValid = await validateButtonCreateTicketArgs(options);
  if (areNotValid) return areNotValid;

  const buttonStyle = getButtonStyleByString(options.buttonColor);

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setStyle(buttonStyle)
      .setLabel(options.buttonText)
      .setCustomId(`${TicketSystemIDs.CreationButton};${options.type}`)
  );

  const embed = new EmbedBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setColor(ticketSystemEmbedColor);

  await options.interaction.channel.send({
    embeds: [embed],
    components: [actionRow]
  });

  return undefined;
}

async function validateButtonCreateTicketArgs({
  type,
  guildID
}: TicketSystemButtonCreateTicketPayload
): Promise<string | undefined> {
  const maybeTicketType = await TicketType.getEntry({ guildID, typeName: type });
  if (!maybeTicketType) return `\`Error:\` Type \`${type}\` does not exist`;

  return undefined;
}

function getButtonStyleByString(style: string): ButtonStyle {
  switch (style) {
    case 'PRIMARY': return ButtonStyle.Primary;
    case 'SECONDARY': return ButtonStyle.Secondary;
    case 'SUCCESS': return ButtonStyle.Success;
    case 'DANGER': return ButtonStyle.Danger;
    default: return ButtonStyle.Primary;
  }
}

export async function executeButtonCreateTicket(interaction: ButtonInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const response = await validateTicketOpening(interaction);
  if (typeof response == 'string') {
    await InteractionHelper.followUp(interaction, response);
    return;
  }

  if (!response.modalInformation) {
    await createTicket(interaction, response);
  } else {
    console.log('handle modal');
  }
}

async function validateTicketOpening(interaction: ButtonInteraction): Promise<TicketType | string> {
  const typeName = interaction.customId.split(';')[2];
  const maybeTicketType = await TicketType.getEntry({ guildID: interaction.guildId, typeName });

  if (!maybeTicketType)
    return `\`Error:\` Type \`${typeName}\` does not exist. Please inform the server team`;

  try {
    const role = await getRole(interaction.client, interaction.guildId, maybeTicketType.roleID);
  } catch {
    return `\`Error:\` Role for type \`${typeName}\` does not exist. Please inform the server team`;
  }

  return maybeTicketType;
}

async function createTicket(interaction: ButtonInteraction, type: TicketType): Promise<void> {
  if (!(interaction.channel instanceof TextChannel))
    throw new Error('Something went wrong while creating the ticket in TextChannel');

  const senderUser = await getMemberFromAPIGuildMember(interaction.client, interaction.guildId!, interaction.member!);
  const threadID = await createThreadForID({ interaction, type, senderUser });
  
  await Ticket.create({
    uuid: await Ticket.createNewValidUUID(),
    guildID: interaction.guildId,
    authorID: senderUser.id,
    threadID,
    type: type.typeName,
    status: 'open'
  });

  await InteractionHelper.followUp(interaction, `\`Success:\` Ticket created: <#${threadID}>`);
}

async function createThreadForID({
  interaction,
  type,
  senderUser
}: {
  interaction: ButtonInteraction;
  type: TicketType;
  senderUser: GuildMember;
}): Promise<string> {
  const channel = interaction.channel;

  if (!(channel instanceof TextChannel))
    throw new Error('Something went wrong while creating the ticket in TextChannel');

  const { threadName, threadReason } = await getThreadCreationDetails(type, senderUser);
  const embed = getThreadStarterEmbed(type, senderUser);

  const thread = await channel.threads.create({
    name: threadName,
    reason: threadReason,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    type: ChannelType.PrivateThread
  });

  await thread.members.add(senderUser.id);
  await thread.send({ content: `<@&${type.roleID}>`, embeds: [embed] });
  return thread.id;
}

async function getThreadCreationDetails(type: TicketType, senderUser: GuildMember): Promise<{
  threadName: string;
  threadReason: string;
}> {
  const ticketAmount = await Ticket.count({ where: { guildID: type.guildID, type: type.typeName } });
  const ticketNumber = (ticketAmount + 1).toString().padStart(4, '0');
  const threadName = `${type.prefix}-${ticketNumber}`;
  const threadReason = `${type.typeName} Ticket created by <@${senderUser.id}>`;

  return { threadName, threadReason };
}

function getThreadStarterEmbed(type: TicketType, senderUser: GuildMember): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`${capitalizeFirstLetter(type.typeName)} Ticket`)
    .setColor(ticketSystemEmbedColor)
    .setDescription(`
      Welcome to the Ticket Support <@${senderUser.id}>!
      If you haven't already please describe your issue in detail, so we can help you as soon as possible.
    `);
}