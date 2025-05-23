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
import { ConfigEditPayload } from "@hafemi/quippy.lib.types";
import {
  editLogChannelConfig,
  getEmbedWithServerConfigData,
  getServerConfigDatabaseEntry,
  isServerConfigEmpty
} from "@hafemi/quippy.system.server-config.command";

const configurationStringOptions: APIApplicationCommandOptionChoice<string>[] = [
  { name: 'Log Channel', value: 'LOGCHANNEL' }
];

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('serverconfig')
  .setDescription('Configure server settings')
  .setContexts([InteractionContextType.Guild])
  .addSubcommand(subcommand => subcommand
    .setName('edit')
    .setDescription('Edit a server configuration')
    .addStringOption(option => option
      .setName('configuration')
      .setDescription('Configuration to edit')
      .addChoices(...configurationStringOptions)
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('value')
      .setDescription('New value for the configuration')
      .setRequired(true)
    )
  )
  .addSubcommand(subcommand => subcommand
    .setName('list')
    .setDescription('List all server configurations')
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();

  const maybePermissionError = await validateUserPermission(interaction);
  if (maybePermissionError) {
    await InteractionHelper.followUp(interaction, maybePermissionError);
    return;
  }

  if (subcommand == 'edit') return await executeEdit(interaction);
  if (subcommand == 'list') return await executeList(interaction);

  await InteractionHelper.followUp(interaction, `\`Error:\` Unknown subcommand '${subcommand}'`);
}

async function validateUserPermission(interaction: ChatInputCommandInteraction): Promise<string | undefined> {
  const hasPermission = await hasUserPermission(interaction, PermissionFlagsBits.Administrator);
  if (!hasPermission)
    return '`Error: `You need Administrator permissions to use this subcommand';

  return undefined;
}

async function executeEdit(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const configuration = interaction.options.getString('configuration');
  const value = interaction.options.getString('value');
  const serverConfig = await getServerConfigDatabaseEntry(interaction);
  const payload: ConfigEditPayload = {
    interaction,
    value: value,
    serverConfig: serverConfig
  };

  switch (configuration) {
    case 'LOGCHANNEL':
      await editLogChannelConfig(payload);
      break;
    default:
      throw new Error(`Unknown configuration '${configuration}'`);
  }
}

async function executeList(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const serverConfig = await getServerConfigDatabaseEntry(interaction);
  const isEmpty = isServerConfigEmpty(serverConfig);
  if (isEmpty) {
    await InteractionHelper.followUp(interaction, '`Info:` This Server does not have any configuration set');
    return;
  }

  const configEmbed = getEmbedWithServerConfigData(interaction, serverConfig);
  await InteractionHelper.followUp(interaction, { embeds: [configEmbed] });
}