import {
  APIApplicationCommandOptionChoice,
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";
import {
  capitalizeFirstLetter,
  fetchMessageById
} from "@hafemi/quippy.lib.utils";
import {
  getAPIFormatForID,
  getLimitationsEmbed
} from "@hafemi/quippy.system.embed";
import { getStarterEmbed } from "@hafemi/quippy.system.embed-create";
import { createAttachmentFromString } from "@cd/core.djs.attachment"

const formatStringOptions: APIApplicationCommandOptionChoice<string>[] = [
  { name: 'User', value: 'user' },
  { name: 'Channel', value: 'channel' },
  { name: 'Role', value: 'role' },
];

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Create your own embed message')
  .setContexts([InteractionContextType.Guild])
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addSubcommand(subcommand => subcommand
    .setName('create')
    .setDescription('Create a new Embed'))
  .addSubcommand(subcommand => subcommand
    .setName('limitations')
    .setDescription('View the limitations of the EmbedBuilder'))
  .addSubcommand(subcommand => subcommand
    .setName('format')
    .setDescription('Get the API format for an ID')
    .addStringOption(option => option
      .setName('type')
      .setDescription('The type of ID to format')
      .setRequired(true)
      .addChoices(formatStringOptions))
    .addStringOption(option => option
      .setName('id')
      .setDescription('The ID to format')
      .setRequired(true)))
  .addSubcommand(subcommand => subcommand
    .setName('export')
    .setDescription('Export the embed\'s from a message')
    .addStringOption(option => option
      .setName('id')
      .setDescription('The Message ID to export the embed\'s from')
      .setRequired(true)));

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const subcommand = interaction.options.getSubcommand();

  if (subcommand == 'create') return await executeCreate(interaction);
  if (subcommand == 'limitations') return await executeLimitations(interaction);
  if (subcommand == 'format') return await executeFormat(interaction);
  if (subcommand == 'export') return await executeExport(interaction);

  await InteractionHelper.followUp(interaction, '`Error:` Unknown subcommand \'' + subcommand + '\'');
}

async function executeCreate(interaction: ChatInputCommandInteraction): Promise<void> {
  const messagePayload = getStarterEmbed();
  await interaction.channel.send({
    embeds: [messagePayload.emptyEmbed],
    components: [...messagePayload.actionRows]
  });

  await InteractionHelper.followUp(interaction, '`Success:` Embed message created');
}

async function executeLimitations(interaction: ChatInputCommandInteraction): Promise<void> {
  const embed = getLimitationsEmbed();
  await InteractionHelper.followUp(interaction, { embeds: [embed] });
}

async function executeFormat(interaction: ChatInputCommandInteraction): Promise<void> {
  const type = interaction.options.getString('type');
  const id = interaction.options.getString('id');
  const formattedId = getAPIFormatForID(type, id);
  const capitalizedType = capitalizeFirstLetter(type)
  
  await InteractionHelper.followUp(interaction, `\`Success:\` Formatted ${capitalizedType} ID: \`${formattedId}\``);
}

async function executeExport(interaction: ChatInputCommandInteraction): Promise<void> {
  const messageID = interaction.options.getString('id');
  const optionalMessage = await fetchMessageById({ channel: interaction.channel, messageId: messageID });
  
  if (!optionalMessage) {
    await InteractionHelper.followUp(interaction, '`Error:` Message not found');
    return;
  }
  
  const embedString = JSON.stringify(optionalMessage.embeds, null, 2);
  const attachment = createAttachmentFromString(embedString, `${messageID}-embeds.json`);
  await InteractionHelper.followUp(interaction, { files: [attachment] });
}