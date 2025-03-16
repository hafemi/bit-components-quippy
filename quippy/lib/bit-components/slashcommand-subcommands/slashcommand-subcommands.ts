import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('Name')
  .setDescription('Description')
  .setContexts([InteractionContextType.Guild])
  .addSubcommand(subcommand => subcommand
    .setName('example')
    .setDescription('Example'));

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand == 'example') return await executeExample(interaction);

  await InteractionHelper.followUp(interaction, `\`Error:\` Unknown subcommand '${subcommand}'`);
}

async function executeExample(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  console.log('executed example');
}