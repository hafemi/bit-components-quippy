import {
  ChatInputCommandInteraction,
  EmbedBuilder
} from "discord.js";

import {
  defaultEmbedColor,
  githubRepoLink
} from '@hafemi/quippy.lib.constants';
import { formatNumberWithApostrophes } from "@hafemi/quippy.lib.utils";
import { Ticket } from "@hafemi/quippy.system.ticket-system.database-definition";

export function getClientLatencyWithinEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
  const clientLatency = getClientLatency(interaction);

  return new EmbedBuilder()
    .setColor(defaultEmbedColor)
    .setTitle('Latency')
    .addFields(
      { name: 'Bot', value: `${clientLatency.bot}ms` },
      { name: 'WS', value: `${clientLatency.ws}ms` }
    );
}

function getClientLatency(interaction: ChatInputCommandInteraction): {
  bot: number,
  ws: number;
} {
  const bot = Date.now() - interaction.createdTimestamp;
  const ws = Math.round(interaction.client.ws.ping);

  return { bot, ws };
}

export async function getBotInfoEmbed(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
  const botInfo = await getBotInfo(interaction);

  const infoEmbed = new EmbedBuilder()
    .setColor(defaultEmbedColor)
    .setTitle('🤖 Bot Information')
    .setDescription(`
      » Multi-functional bot with a variety of features
      » [GitHub Repository](${githubRepoLink})
    `);

  infoEmbed.addFields(
    { name: 'Guild Amount', value: `${botInfo.guilds}`, inline: true },
    { name: 'User Amount', value: `${botInfo.users}`, inline: true },
    { name: 'Command Amount', value: `${botInfo.commands}`, inline: true }
  );

  infoEmbed.addFields(
    { name: 'Uptime', value: `${botInfo.uptime}`, inline: true },
    { name: 'Tickets created', value: `${botInfo.tickets}`, inline: true }
  );

  return infoEmbed;
}

async function getBotInfo(interaction: ChatInputCommandInteraction): Promise<
  {
    guilds: string;
    users: string;
    tickets: string;
    uptime: string;
    commands: number;
  }
> {
  const guilds = (await Promise.all((await interaction.client.guilds.fetch()).map(guild => guild.fetch())));
  const guildsCount = guilds.length;
  const userCount = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);
  const uptime = getBotUptime(interaction);
  const commandCount = (await interaction.client.application?.commands.fetch()).size;
  
  // @ts-ignore
  const ticketCount = await Ticket.max('id');

  return {
    guilds: formatNumberWithApostrophes(guildsCount),
    users: formatNumberWithApostrophes(userCount),
    tickets: formatNumberWithApostrophes(ticketCount as number),
    uptime,
    commands: commandCount,
  };
}

function getBotUptime(interaction: ChatInputCommandInteraction): string {
  const seconds = Math.floor(interaction.client.uptime / 1000);
  const currentSeconds = Math.floor(Date.now() / 1000);
  const epochSeconds = currentSeconds - seconds;

  return `<t:${epochSeconds}:f>`;
}