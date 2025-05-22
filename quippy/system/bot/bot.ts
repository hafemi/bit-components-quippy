import {
  ChatInputCommandInteraction,
  EmbedBuilder
} from "discord.js";

import { sequelize } from "@cd/core.database.sequelize.default-connection";
import {
  defaultEmbedColor,
  discordHelpServerLink,
  githubCommandsLink,
  githubRepoLink
} from '@hafemi/quippy.lib.constants';
import {
  formatNumberWithApostrophes
} from "@hafemi/quippy.lib.utils";
import { QueryTypes } from "sequelize";

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
  const botUptime = getBotUptime(interaction)

  const infoEmbed = new EmbedBuilder()
    .setColor(defaultEmbedColor)
    .setTitle('🤖 Bot Information')
    .setDescription(`
      Multi-functional bot with a variety of features
      • [Commands List](${githubCommandsLink})
      • [Discord Help Server](${discordHelpServerLink})
      • [GitHub Repository](${githubRepoLink})
    `)
    .addFields(
      { name: 'Uptime', value: `${botUptime}`, inline: true },
    )

  return infoEmbed;
}

function getBotUptime(interaction: ChatInputCommandInteraction): string {
  const seconds = Math.floor(interaction.client.uptime / 1000);
  const currentSeconds = Math.floor(Date.now() / 1000);
  const epochSeconds = currentSeconds - seconds;

  return `<t:${epochSeconds}:f>`;
}

export async function getBotStatisticsEmbed(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
  const botInfo = await getBotStatistics(interaction);

  const statisticsEmbed = new EmbedBuilder()
    .setColor(defaultEmbedColor)
    .setTitle('📊 Bot Statistics')
    .setDescription(null);

  statisticsEmbed.addFields(
    { name: 'In Guilds', value: `${botInfo.guilds}`, inline: true },
    { name: 'Watching Users', value: `${botInfo.users}`, inline: true },
    { name: 'Tickets Created', value: `${botInfo.tickets}`, inline: true },
    { name: 'Unique Commands', value: `${botInfo.commands}`, inline: true },
  );

  return statisticsEmbed;
}

async function getBotStatistics(interaction: ChatInputCommandInteraction): Promise<
  {
    guilds: string;
    users: string;
    tickets: string;
    commands: number;
  }
> {
  const guilds = (await Promise.all((await interaction.client.guilds.fetch()).map(guild => guild.fetch())));
  const guildsCount = guilds.length;
  const userCount = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);
  const commandCount = (await interaction.client.application?.commands.fetch()).size;
  const nextAutoIncrement = await getNextTicketAutoIncrement('ticket');

  return {
    guilds: formatNumberWithApostrophes(guildsCount),
    users: formatNumberWithApostrophes(userCount),
    tickets: formatNumberWithApostrophes(nextAutoIncrement - 1),
    commands: commandCount,
  };
}

async function getNextTicketAutoIncrement(modelName: string): Promise<number> {
  // update the count
  await sequelize.query(`ANALYZE TABLE ticket`, {
    type: QueryTypes.SELECT
  });
  const result = await sequelize.query(`SHOW TABLE STATUS LIKE 'ticket'`, {
    type: QueryTypes.SELECT
  });

  return (result[0] as { Auto_increment: number; }).Auto_increment;
}