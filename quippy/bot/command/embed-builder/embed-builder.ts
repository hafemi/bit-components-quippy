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
  capitalizeFirstLetter
} from "@hafemi/quippy.lib.utils";
import {
  getAPIFormatForID,
  getLimitationsEmbed,
  handleEmbedExport,
  sendEmbedFromAttachmentData
} from "@hafemi/quippy.system.embed-builder";
import { getStarterEmbed } from "@hafemi/quippy.system.embed-builder-create";

const formatStringOptions: APIApplicationCommandOptionChoice<string>[] = [
  { name: 'User', value: 'user' },
  { name: 'Channel', value: 'channel' },
  { name: 'Role', value: 'role' },
];

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Construct and manage your own embed')
  .setContexts([InteractionContextType.Guild])
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addSubcommand(subcommand => subcommand
    .setName('create')
    .setDescription('Create a new Embed'))
  .addSubcommand(subcommand => subcommand
    .setName('limitations')
    .setDescription('Check the limitations of the EmbedBuilder'))
  .addSubcommand(subcommand => subcommand
    .setName('format')
    .setDescription('Turn an ID into a format that the embed can use')
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
      .setName('messageid')
      .setDescription('The Message ID to export the embed\'s from')
      .setRequired(true)))
  .addSubcommand(subcommand => subcommand
    .setName('import')
    .setDescription('Import an embed')
    .addAttachmentOption(option => option
      .setName('file')
      .setDescription('The file to import')
      .setRequired(true)));

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand == 'create') return await executeCreate(interaction);
  if (subcommand == 'limitations') return await executeLimitations(interaction);
  if (subcommand == 'format') return await executeFormat(interaction);
  if (subcommand == 'export') return await executeExport(interaction);
  if (subcommand == 'import') return await executeImport(interaction);

  await InteractionHelper.followUp(interaction, `> ❌ \`Error:\` '${subcommand}' does not exist as a subcommand for the \`/embed\` command`);
}

async function executeCreate(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const messagePayload = getStarterEmbed();
  await interaction.channel.send({
    embeds: [messagePayload.emptyEmbed],
    components: [...messagePayload.actionRows]
  });

  await InteractionHelper.followUp(interaction, '> ✅ `Success:` The embed message has been created and sent');
}

async function executeLimitations(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const embed = getLimitationsEmbed();
  await InteractionHelper.followUp(interaction, { embeds: [embed] });
}

async function executeFormat(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const type = interaction.options.getString('type');
  const id = interaction.options.getString('id');
  const formattedId = getAPIFormatForID(type, id);
  const capitalizedType = capitalizeFirstLetter(type);

  await InteractionHelper.followUp(interaction, `> ✅ \`Success:\` The ID \`${id}\` has been formatted to ${capitalizedType} \`${formattedId}\``);
}

async function executeExport(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const messageId = interaction.options.getString('messageid');
  const maybeResponse = await handleEmbedExport(interaction, messageId);

  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
}

async function executeImport(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const attachment = interaction.options.getAttachment('file');
  const maybeResponse = await sendEmbedFromAttachmentData(interaction, attachment);

  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else
    await InteractionHelper.followUp(interaction, '> ✅ `Success:` The embed\'s have been imported');

}