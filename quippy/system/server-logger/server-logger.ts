import {
  getChannelFromServerConfig,
  fetchMessagesFromChannel
 } from "@hafemi/quippy.lib.utils";
import {
  BaseMessageOptions,
  ButtonInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  User
} from "discord.js";

import {
  LoggingType,
  EmbedColor
 } from "@hafemi/quippy.lib.types";

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
    .setDescription(`Channel: <#${interaction.channelId}> \nExecuted by: <@${interaction.user.id}>`)
    .setColor(EmbedColor.Log)
    .setTimestamp()
    .setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL()
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

export function getThreadUserEditEmbedLogData(
  interaction: ChatInputCommandInteraction,
  type: LoggingType,
  user: User
): BaseMessageOptions {
  const embed = constructServerLogEmbed({
    interaction,
    type
  });

  embed.setDescription(`${embed.data.description} \nUser: <@${user.id}>`);
  
  return { embeds: [embed] };
}

export async function getTicketClosedLogData(
  interaction: ChatInputCommandInteraction,
  reason: string
): Promise<BaseMessageOptions> {
  const attachment = await fetchMessagesFromChannel(interaction.channel, 2000);
  const embed = constructServerLogEmbed({
    interaction,
    type: LoggingType.TicketClosed
  });
  
  embed.setDescription(`
    Channel: ${interaction.channel.name}
    Executed by: <@${interaction.user.id}>
    Reason: ${reason} 
  `);
  
  return {
    embeds: [embed],
    files: [attachment]
  }
}