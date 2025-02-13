import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

export const data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responds with Pong')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    //TODO Command Statistics
    await interaction.deferReply({ ephemeral: true });

    await InteractionHelper.followUp(interaction, '> Pong!', true);
}


