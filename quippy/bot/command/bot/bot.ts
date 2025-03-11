import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

import {
  getBotInfoEmbed,
  getClientLatencyWithinEmbed
} from '@hafemi/quippy.system.bot';

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('bot')
  .setDescription('Retrieve information about the bot')
  .setContexts([InteractionContextType.Guild])
  .addSubcommand(subcommand => subcommand
    .setName('latency')
    .setDescription('Get the bot\'s current latency'))
  .addSubcommand(subcommand => subcommand
    .setName('info')
    .setDescription('Get information about the bot'));

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand == 'latency') return await executeLatency(interaction);
  if (subcommand == 'info') return await executeInfo(interaction);

  await InteractionHelper.followUp(interaction, `\`Error:\` Unknown subcommand '${subcommand}'`);
}

async function executeLatency(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
  
  const latencyEmbed = getClientLatencyWithinEmbed(interaction);
  await InteractionHelper.followUp(interaction, { embeds: [latencyEmbed] });
}

async function executeInfo(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
  
  const infoEmbed = await getBotInfoEmbed(interaction);
  await InteractionHelper.followUp(interaction, { embeds: [infoEmbed] });
}