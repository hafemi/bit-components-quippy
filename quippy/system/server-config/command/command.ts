import {
  ConfigEditPayload,
  EmbedColor
 } from "@hafemi/quippy.lib.types";
import { capitalizeFirstLetter, isChannel } from "@hafemi/quippy.lib.utils";
import { ServerConfig } from "@hafemi/quippy.system.server-config.database-definition";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

export async function getServerConfigDatabaseEntry(interaction: ChatInputCommandInteraction): Promise<ServerConfig> {
  const serverConfig = await ServerConfig.getEntry({ guildId: interaction.guildId });
  if (serverConfig)
    return serverConfig;
  
  console.log('getConfig returning new config')
  return await ServerConfig.create({
    uuid: await ServerConfig.createNewValidUUID(),
    guildId: interaction.guildId,
    channelIds: {}
  });
}

export async function editLogChannelConfig({ 
  interaction,
  value,
  serverConfig
}: ConfigEditPayload): Promise<void> {
  const isValidChannelID = await isChannel(interaction, value);
  if (!isValidChannelID) {
    await InteractionHelper.followUp(interaction, `\`❌ Error:\` The ID \`${value}\` is not a valid channel`);
    return;
  }
  
  serverConfig.channelIds = {
    ...serverConfig.channelIds,
    logChannel: value
  }
  await serverConfig.save();
  await InteractionHelper.followUp(interaction, `\`✅ Success:\` The log channel has been set to <#${value}>`);
}

export function isServerConfigEmpty(config: ServerConfig): boolean { 
  if (Object.keys(config.channelIds).length == 0)
    return true;
  
  return false;
}

export function getEmbedWithServerConfigData(interaction: ChatInputCommandInteraction, config: ServerConfig): EmbedBuilder {
  const configEmbed = new EmbedBuilder()
    .setColor(EmbedColor.Default)
    .setTitle('Server Configuration')
    .setThumbnail(interaction.guild.iconURL())
  
  const configToValue = getStringRecordWithServerConfig(config)

  configEmbed.addFields([
    {
      name: 'Configuration',
      value: Object.keys(configToValue).map(key => capitalizeFirstLetter(key)).join('\n'),
      inline: true
    },
    {
      name: 'Value',
      value: Object.values(configToValue).map(value => `${value}`).join('\n'),
      inline: true
    }
  ])
  
  return configEmbed
}

function getStringRecordWithServerConfig(config: ServerConfig): Record<string, string> {
  const configToValue: Record<string, string> = {}
  
  for (const key in config.channelIds) {
    configToValue[key] = config.channelIds[key]
  }

  return configToValue
}