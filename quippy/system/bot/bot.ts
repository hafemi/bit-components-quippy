import {
  ChatInputCommandInteraction,
  EmbedBuilder
} from "discord.js";

import {
  defaultEmbedColor
} from '@hafemi/quippy.constants';

export function getClientLatencyWithinEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
  const clientLatency = getClientLatency(interaction);

  return new EmbedBuilder()
    .setColor(defaultEmbedColor)
    .setTitle('Latency')
    .addFields(
      { name: 'Bot', value: `${clientLatency.bot}ms` },
      { name: 'WS', value: `${clientLatency.ws}ms` }
    )
}

function getClientLatency(interaction: ChatInputCommandInteraction): {
  bot: number,
  ws: number;
} {
  const bot = Date.now() - interaction.createdTimestamp;
  const ws = Math.round(interaction.client.ws.ping);

  return { bot, ws };
}
