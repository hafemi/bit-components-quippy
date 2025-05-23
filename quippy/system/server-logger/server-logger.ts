import { logEmbedColor } from "@hafemi/quippy.lib.constants";
import { getChannelFromServerConfig } from "@hafemi/quippy.lib.utils";
import {
  BaseMessageOptions,
  ButtonInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder
} from "discord.js";

import { LoggingType } from "@hafemi/quippy.lib.types";

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
    type: LoggingType;
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

// used when no additional description or files are needed for the log
export function getPlainEmbedLogData(
  interaction: ButtonInteraction,
  type: LoggingType
): BaseMessageOptions { 
  const embed = constructServerLogEmbed({
    interaction,
    type
  });

  return { embeds: [embed] };
}