import {
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

import {
  getClientLatencyWithinEmbed
} from '@hafemi/quippy.system.bot';

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('bot')
  .setDescription('Retrieve information about the bot')
  .setContexts([InteractionContextType.Guild])
  .addSubcommand(subcommand => subcommand
    .setName('latency')
    .setDescription('Get the bot\'s current latency')
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand == 'latency')
    return await executeLatency(interaction);

  await InteractionHelper.followUp(interaction, '`Error:` Unknown subcommand \'' + subcommand + '\'', true);
}

async function executeLatency(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const latencyEmbed = getClientLatencyWithinEmbed(interaction);
  await InteractionHelper.followUp(interaction, { embeds: [latencyEmbed] }, true);
}
