import { getChannel } from "@cd/core.djs.channel";
import { ConfigEditPayload } from "@hafemi/quippy.lib.types";
import { ServerConfig } from "@hafemi/quippy.system.server-config.database-definition";
import { ChatInputCommandInteraction } from "discord.js";
import { isChannel } from "@hafemi/quippy.lib.utils";

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
  ServerConfig
}: ConfigEditPayload): Promise<void> {
  const isValidChannelID = await isChannel(interaction, value);
  if (!isValidChannelID) {
    await InteractionHelper.followUp(interaction, '`Error: `The provided channel ID is invalid');
    return;
  }
  
  ServerConfig.channelIds.logChannel = value;
  await ServerConfig.save();
  await InteractionHelper.followUp(interaction, '`Success: `Log channel ID updated');
}