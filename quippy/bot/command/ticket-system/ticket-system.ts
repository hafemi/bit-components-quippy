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
  handleTicketTypeEdit,
  handleTicketTypeRemoval
} from "@hafemi/quippy.system.ticket-system.command";

import { validateUserPermission } from "@hafemi/quippy.lib.utils";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Ticket system')
  .setContexts([InteractionContextType.Guild])
  
  // Ticket Type
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
    .addSubcommand(subcommand => subcommand
      .setName('edit')
      .setDescription('Edit a ticket type')
      .addStringOption(option => option
        .setName('oldname')
        .setDescription('Name of the ticket type to change')
        .setRequired(true))
      .addStringOption(option => option
        .setName('newname')
        .setDescription('New Name of the ticket type'))
      .addRoleOption(option => option
        .setName('newrole')
        .setDescription('New Role to assign to ticket type'))
      .addStringOption(option => option
        .setName('newprefix')
        .setDescription('New Prefix used when creating tickets')))
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
    if (subcommand == 'edit') return await executeTypeEdit(interaction);
  }

  await InteractionHelper.followUp(interaction, `\`Error:\` Unknown subcommand '${subcommand}'`);
}

async function executeTypeAdd(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
  
  const name = interaction.options.getString('name');
  const role = interaction.options.getRole('role');
  const prefix = interaction.options.getString('prefix');
  
  const maybeResponse = await handleTicketTypeCreation({ name, role, prefix, guildID: interaction.guildId });
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

async function executeTypeEdit(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const oldName = interaction.options.getString('oldname');
  const newName = interaction.options.getString('newname');
  const newRole = interaction.options.getRole('newrole');
  const newPrefix = interaction.options.getString('newprefix');
  const guildID = interaction.guildId;
  
  const maybeResponse = await handleTicketTypeEdit({ oldName, newName, newRole, newPrefix, guildID });
  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else 
    await InteractionHelper.followUp(interaction, '`Success:` Ticket type edited');
}