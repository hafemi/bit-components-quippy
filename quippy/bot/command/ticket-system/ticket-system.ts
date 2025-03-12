import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import {
  getTicketTypesEmbed,
  handleTicketTypeCreation,
  handleTicketTypeRemoval
} from "@hafemi/quippy.system.ticket-system.command";

import { validateUserPermission } from "@hafemi/quippy.lib.utils";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Ticket system')
  .setContexts([InteractionContextType.Guild])
  .addSubcommandGroup(subcommandGroup => subcommandGroup
    .setName('type')
    .setDescription('Modify ticket types of this server')
    .addSubcommand(subcommand => subcommand
      .setName('add')
      .setDescription('Add a ticket type')
      .addStringOption(option => option
        .setName('name')
        .setDescription('Name of the ticket type')
        .setRequired(true))
      .addRoleOption(option => option
        .setName('role')
        .setDescription('Role to assign to ticket type')
        .setRequired(true))
      .addStringOption(option => option
        .setName('prefix')
        .setDescription('Prefix used when creating tickets')
        .setRequired(true)))
    .addSubcommand(subcommand => subcommand
      .setName('list')
      .setDescription('List all ticket types of this server'))
    .addSubcommand(subcommand => subcommand
      .setName('remove')
      .setDescription('Remove a ticket type')
      .addStringOption(option => option
        .setName('name')
        .setDescription('Name of the ticket type')
        .setRequired(true)))
  )

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();
  const subcommandGroup = interaction.options.getSubcommandGroup();

  if (subcommandGroup == 'type') { 
    const hasPermissions = await validateUserPermission(interaction, PermissionFlagsBits.Administrator);
    if (!hasPermissions) {
      await InteractionHelper.followUp(interaction, '`Error:` You need Administrator permissions to use this subcommand');
      return;
    }
    
    if (subcommand == 'add') return await executeTypeAdd(interaction);
    if (subcommand == 'list') return await executeTypeList(interaction);
    if (subcommand == 'remove') return await executeTypeRemove(interaction);
  }

  await InteractionHelper.followUp(interaction, `\`Error:\` Unknown subcommand '${subcommand}'`);
}

async function executeTypeAdd(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
  
  const name = interaction.options.getString('name');
  const role = interaction.options.getRole('role');
  const prefix = interaction.options.getString('prefix');
  
  const maybeResponse = await handleTicketTypeCreation({ interaction, name, role, prefix, guildID: interaction.guildId });
  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else 
    await InteractionHelper.followUp(interaction, '`Success:` Ticket type added');
}

async function executeTypeList(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
  
  const maybeEmbed = await getTicketTypesEmbed(interaction.guildId);
  if (maybeEmbed)
    await InteractionHelper.followUp(interaction, {embeds: [maybeEmbed] });
  else 
    await InteractionHelper.followUp(interaction, '`Info:` This Server has no ticket types');
}

async function executeTypeRemove(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
  
  const name = interaction.options.getString('name');
  const maybeResponse = await handleTicketTypeRemoval({ name, guildID: interaction.guildId });
  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else 
    await InteractionHelper.followUp(interaction, '`Success:` Ticket type removed');
}