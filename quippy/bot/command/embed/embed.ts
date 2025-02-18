import {
  ChatInputCommandInteraction,
  ColorResolvable,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

import {
  editColorOfEmbed,
  getEmptyEmbed,
  getLatestMessageWithEmbed,
  validateEmbedColor
} from '@hafemi/quippy.system.embed';

import {
  embedEditMaxMessagesToFetch
} from '@hafemi/quippy.lib.constants';

import {
  EmbedEditPayload
} from '@hafemi/quippy.lib.types';

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Send or edit an existing embed')
  .setContexts([InteractionContextType.Guild])
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addSubcommand(subcommand => subcommand
    .setName('send')
    .setDescription('Send a new embed'))

  .addSubcommandGroup(subcommandGroup => subcommandGroup
    .setName('edit')
    .setDescription('Edit an existing embed')
    .addSubcommand(subcommand => subcommand
      .setName('color')
      .setDescription('Change the color of the embed')
      .addStringOption(option => option
        .setName('value')
        .setDescription('The color of the embed')
        .setRequired(true)
      )
    )
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();
  const subcommandGroup = interaction.options.getSubcommandGroup();
  
  if (subcommandGroup == 'edit') {
    const message = await getLatestMessageWithEmbed(interaction.channel);
    if (!message) {
      await InteractionHelper.followUp(interaction, `\`Error\`: No embed found in the latest ${embedEditMaxMessagesToFetch} messages`, true);
      return;
    }
    const payload: EmbedEditPayload = { interaction, message };
    

    if (subcommand == 'color') return await executeEditColor(payload);
  }

  if (subcommand == 'send') return await executeSend(interaction);

  await InteractionHelper.followUp(interaction, '`Error:` Unknown subcommand \'' + subcommand + '\'', true);
}

async function executeSend(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const emptyEmbed = getEmptyEmbed();

  interaction.channel.send({ embeds: [emptyEmbed] });
  await InteractionHelper.followUp(interaction, '> `Success:` Sent empty embed', true);
}

async function executeEditColor(payload: EmbedEditPayload): Promise<void> {
  const color = payload.interaction.options.getString('value')! as ColorResolvable
  const isValidColor = validateEmbedColor(color);
  
  if (!isValidColor) {
    await InteractionHelper.followUp(payload.interaction, '> `Error:` Invalid color value', true);
    return;
  }
  
  await editColorOfEmbed(payload, color);
}