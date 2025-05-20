import {
  APIApplicationCommandOptionChoice,
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import { hasUserPermission } from "@hafemi/quippy.lib.utils";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

const configurationStringOptions: APIApplicationCommandOptionChoice<string>[] = [
  { name: 'LogChannel', value: 'LOGCHANNEL' }
];

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Server related commands')
  .setContexts([InteractionContextType.Guild])
  .addSubcommandGroup(subcommand => subcommand
    .setName('config')
    .setDescription('View or edit server configuration')
    .addSubcommand(subcommand => subcommand
      .setName('edit')
      .setDescription('Edit server configuration')
      .addStringOption(option => option
        .setName('configuration')
        .setDescription('Configuration to edit')
        .addChoices(...configurationStringOptions)
        .setRequired(true)
      )
    )
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();
  const subcommandGroup = interaction.options.getSubcommandGroup();
  
  const maybePermissionError = await validateUserPermission(interaction, subcommandGroup);
  if (maybePermissionError) {
    await InteractionHelper.followUp(interaction, maybePermissionError);
    return;
  }

  if (subcommandGroup == 'config') {
    if (subcommand == 'edit') executeConfigEdit(interaction);
  }

  await InteractionHelper.followUp(interaction, `\`Error:\` Unknown subcommand '${subcommand}'`);
}

async function validateUserPermission(interaction: ChatInputCommandInteraction, subcommandGroup: string): Promise<string | undefined> {
  const hasPermission = await hasUserPermission(interaction, PermissionFlagsBits.Administrator);
  if (!hasPermission)
    return '`Error: `You need Administrator permissions to use this subcommand';

  return undefined;
}

async function executeConfigEdit(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const configuration = interaction.options.getString('configuration');
  
  switch (configuration) {
    case 'LOGCHANNEL':
      await InteractionHelper.followUp(interaction, '`Error: `This command is not implemented yet');
      break;
    default:
      throw new Error(`Unknown configuration '${configuration}'`);
  }
}