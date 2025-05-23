import { logEmbedColor } from "@hafemi/quippy.lib.constants";
import { getChannelFromServerConfig } from "@hafemi/quippy.lib.utils";
import {
  BaseMessageOptions,
  ButtonInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder
} from "discord.js";

export async function sendToLogChannel({
  interaction,
  messageData
}: {
    interaction: any;
    messageData: BaseMessageOptions;
  }): Promise<void> {
  const logChannel = await getChannelFromServerConfig({ interaction, type: 'logChannel' });
  if (logChannel) {
    await logChannel.send(messageData);
  }
}

function constructServerLogEmbed({
  interaction,
  type,
}: {
    interaction: ChatInputCommandInteraction | ButtonInteraction;
    type: string;
  }): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`🗃️ Server Log - ${type}`)
    .setDescription(`Instigator: <@${interaction.user.id}> \nChannel: <#${interaction.channelId}>`)
    .setColor(logEmbedColor)
    .setThumbnail(interaction.guild.iconURL())
    .setTimestamp()
    .setFooter({
      text: `Logged at`,
      iconURL: interaction.client.user.avatarURL()
    });
}

export function getTicketCreatedLogData(interaction: ButtonInteraction): BaseMessageOptions {
  const embed = constructServerLogEmbed({
    interaction,
    type: "Ticket Created"
  })
  
  return { embeds: [embed] }
}