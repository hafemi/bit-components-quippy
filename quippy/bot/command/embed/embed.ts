import {
  APIApplicationCommandOptionChoice,
  channelMention,
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";
import {
  getMessagePayload,
  getLimitationsEmbed,
  getAPIFormatForID
} from "@hafemi/quippy.system.embed";
import {
  capitalizeFirstLetter
  
 } from "@hafemi/quippy.lib.utils"

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
      .setName('format_type')
      .setDescription('The type of ID to format')
      .setRequired(true)
      .addChoices(formatStringOptions))
    .addStringOption(option => option
      .setName('format_id')
      .setDescription('The ID to format')
      .setRequired(true))
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const subcommand = interaction.options.getSubcommand();

  if (subcommand == 'create') return await executeCreate(interaction);
  if (subcommand == 'limitations') return await executeLimitations(interaction);
  if (subcommand == 'format') return await executeFormat(interaction);

  await InteractionHelper.followUp(interaction, '`Error:` Unknown subcommand \'' + subcommand + '\'');
}

async function executeCreate(interaction: ChatInputCommandInteraction): Promise<void> {
  const messagePayload = getMessagePayload();
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
  const type = interaction.options.getString('format_type');
  const id = interaction.options.getString('format_id');
  const formattedId = getAPIFormatForID(type, id);
  const capitalizedType = capitalizeFirstLetter(type)
  
  await InteractionHelper.followUp(interaction, `\`Success:\` Formatted ${capitalizedType} ID: \`${formattedId}\``);

}