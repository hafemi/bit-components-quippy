import {
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";
import {
  getMessagePayload
} from "@hafemi/quippy.system.embed";

export const data: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Create your own embed message')
  .setContexts([InteractionContextType.Guild])
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addSubcommand(subcommand => subcommand
    .setName('create')
    .setDescription('Create a new Embed'));

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const subcommand = interaction.options.getSubcommand();

  if (subcommand == 'create') return await executeCreate(interaction);

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