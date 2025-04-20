import {
  APIApplicationCommandOptionChoice,
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import {
  getTicketTypesEmbed,
  handleButtonCreateTicket,
  handleButtonEditing,
  handleTicketTypeCreation,
  handleTicketTypeEdit,
  handleTicketTypeRemoval,
  handleUserAction
} from "@hafemi/quippy.system.ticket-system.command";

import {
  EmbedBuilderLimitations,
  TicketSystemButtonCreateTicketPayload,
  TicketSystemLimitations,
} from "@hafemi/quippy.lib.types";
import { fetchMessagesFromChannel, hasUserPermission } from "@hafemi/quippy.lib.utils";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";
import { Ticket } from "@hafemi/quippy.system.ticket-system.database-definition";

const buttonColorStringOptions: APIApplicationCommandOptionChoice<string>[] = [
  { name: 'Blue', value: 'PRIMARY' },
  { name: 'Red', value: 'DANGER' },
  { name: 'Green', value: 'SUCCESS' },
  { name: 'Grey', value: 'SECONDARY' }
];

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
        .setMaxLength(TicketSystemLimitations.Name)
        .setRequired(true))
      .addRoleOption(option => option
        .setName('role')
        .setDescription('Role to assign to ticket type')
        .setRequired(true))
      .addStringOption(option => option
        .setName('prefix')
        .setDescription('Prefix used when creating tickets')
        .setMaxLength(TicketSystemLimitations.Prefix)
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
        .setName('type')
        .setDescription('Ticket type to change')
        .setRequired(true))
      .addRoleOption(option => option
        .setName('newrole')
        .setDescription('New Role to assign to ticket type'))
      .addStringOption(option => option
        .setName('newprefix')
        .setDescription('New Prefix used when creating tickets')
        .setMaxLength(TicketSystemLimitations.Prefix))
    )
  )

  // Button
  .addSubcommandGroup(subcommandGroup => subcommandGroup
    .setName('button')
    .setDescription('Add a button to create a ticket')
    .addSubcommand(subcommand => subcommand
      .setName('create')
      .setDescription('Send a button in the channel to create tickets')
      .addStringOption(option => option
        .setName('type')
        .setDescription('Type of the ticket')
        .setRequired(true))
      .addStringOption(option => option
        .setName('title')
        .setDescription('Title for the embed')
        .setMaxLength(EmbedBuilderLimitations.Title)
        .setRequired(true))
      .addStringOption(option => option
        .setName('description')
        .setDescription('Description for the embed')
        .setMaxLength(EmbedBuilderLimitations.Description)
        .setRequired(true))
      .addStringOption(option => option
        .setName('buttoncolor')
        .setDescription('Color of the button')
        .addChoices(buttonColorStringOptions)
        .setRequired(true))
      .addStringOption(option => option
        .setName('buttontext')
        .setDescription('Text of the button')
        .setMaxLength(TicketSystemLimitations.CreationButton)
        .setRequired(true)))
    .addSubcommand(subcommand => subcommand
      .setName('disable')
      .setDescription('Disable the buttons of a message')
      .addStringOption(option => option
        .setName('messageid')
        .setDescription('ID of the message')
        .setRequired(true)))
    .addSubcommand(subcommand => subcommand
      .setName('enable')
      .setDescription('Enable the buttons of a message')
      .addStringOption(option => option
        .setName('messageid')
        .setDescription('ID of the message')
        .setRequired(true)))
)

  // User
  .addSubcommandGroup(subcommandGroup => subcommandGroup
    .setName('user')
    .setDescription('Add or remove a user from a ticket')
    .addSubcommand(subcommand => subcommand
      .setName('add')
      .setDescription('Add a user to a ticket')
      .addUserOption(option => option
        .setName('user')
        .setDescription('User to add')
        .setRequired(true)))
    .addSubcommand(subcommand => subcommand
      .setName('remove')
      .setDescription('Remove a user from a ticket')
      .addUserOption(option => option
        .setName('user')
        .setDescription('User to remove')
        .setRequired(true)))
  )

  // Standalone
  .addSubcommand(subcommand => subcommand
    .setName('transcript')
    .setDescription('Get a transcript of the ticket')
  )
  

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();
  const subcommandGroup = interaction.options.getSubcommandGroup();

  const maybePermissionError = await validateUserPermission(interaction, subcommandGroup);
  if (maybePermissionError) {
    await InteractionHelper.followUp(interaction, maybePermissionError);
    return;
  }

  if (subcommandGroup == 'type') {
    if (subcommand == 'add') return await executeTypeAdd(interaction);
    if (subcommand == 'list') return await executeTypeList(interaction);
    if (subcommand == 'remove') return await executeTypeRemove(interaction);
    if (subcommand == 'edit') return await executeTypeEdit(interaction);
  }

  if (subcommandGroup == 'button') {
    if (subcommand == 'create') return await executeButtonCreate(interaction);
    if (subcommand == 'disable') return await executeButtonDisable(interaction);
    if (subcommand == 'enable') return await executeButtonEnable(interaction);
  }
  
  if (subcommandGroup == 'user') {
    if (subcommand == 'add') return await executeUserAdd(interaction);
    if (subcommand == 'remove') return await executeUserRemove(interaction);
  }
  
  if (subcommand == 'transcript') return await executeTranscript(interaction);

  await InteractionHelper.followUp(interaction, `\`Error:\` Unknown subcommand '${subcommand}'`);
}

async function validateUserPermission(interaction: ChatInputCommandInteraction, subcommandGroup: string): Promise<string | undefined> { 
  if (
    subcommandGroup == 'type' ||
    subcommandGroup == 'button'
  ) {
    const hasPermission = await hasUserPermission(interaction, PermissionFlagsBits.Administrator);
    if (!hasPermission
    )
      return '`Error: `You need Administrator permissions to use this subcommand'
  }
  
  return undefined
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
    await InteractionHelper.followUp(interaction, { embeds: [maybeEmbed] });
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

  const type = interaction.options.getString('type');
  const newRole = interaction.options.getRole('newrole');
  const newPrefix = interaction.options.getString('newprefix');
  const guildID = interaction.guildId;

  const maybeResponse = await handleTicketTypeEdit({ type, newRole, newPrefix, guildID });
  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else
    await InteractionHelper.followUp(interaction, '`Success:` Ticket type edited');
}

async function executeButtonCreate(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const infoPayload: TicketSystemButtonCreateTicketPayload = {
    interaction,
    type: interaction.options.getString('type'),
    title: interaction.options.getString('title'),
    description: interaction.options.getString('description'),
    buttonColor: interaction.options.getString('buttoncolor'),
    buttonText: interaction.options.getString('buttontext'),
    guildID: interaction.guildId
  };

  const maybeResponse = await handleButtonCreateTicket(infoPayload);
  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else
    await InteractionHelper.followUp(interaction, '`Success:` Button created');
}

async function executeButtonDisable(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const messageId = interaction.options.getString('messageid');
  const maybeResponse = await handleButtonEditing({ interaction, messageId, type: 'disable' })
  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else
    await InteractionHelper.followUp(interaction, '`Success:` Button disabled');
}

async function executeButtonEnable(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const messageId = interaction.options.getString('messageid');
  const maybeResponse = await handleButtonEditing({ interaction, messageId, type: 'enable' })
  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else
    await InteractionHelper.followUp(interaction, '`Success:` Button enabled');
}

async function executeUserAdd(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const user = interaction.options.getUser('user');
  const maybeResponse = await handleUserAction({ interaction, user, action: 'add' });
  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else
    await InteractionHelper.followUp(interaction, '`Success:` User added to ticket');
}

async function executeUserRemove(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const user = interaction.options.getUser('user');
  const maybeResponse = await handleUserAction({ interaction, user, action: 'remove' });
  if (maybeResponse)
    await InteractionHelper.followUp(interaction, maybeResponse);
  else
    await InteractionHelper.followUp(interaction, '`Success:` User removed from ticket');
}

async function executeTranscript(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const isChannelATicket = await Ticket.isEntry({ guildID: interaction.guildId, threadID: interaction.channelId });
  if (!isChannelATicket) {
    await InteractionHelper.followUp(interaction, '`Error:` This channel is not a ticket');
    return;
  }
  
  const attachment = await fetchMessagesFromChannel(interaction.channel, 99999);
  await InteractionHelper.followUp(interaction, { files: [attachment] });
}  