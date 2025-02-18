import {
  ChatInputCommandInteraction,
  EmbedBuilder
} from "discord.js";

import {
  defaultEmbedColor,
  githubRepoLink
} from '@hafemi/quippy.lib.constants';

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
  const guilds = (await Promise.all((await interaction.client.guilds.fetch()).map(guild => guild.fetch())));
  const guildsCount = guilds.length;
  const userCount = interaction.client.users.cache.size;
  const uptime = getBotUptime(interaction);
  const commandCount = await getCommandCount(interaction);

  return new EmbedBuilder()
    .setColor(defaultEmbedColor)
    .setTitle('🤖 Bot Information')
    .setDescription(`
      » Multi-functional bot with a variety of features
      » [GitHub Repository](${githubRepoLink})
    `)
    .addFields(
      { name: 'Guild Amount', value: `${guildsCount}`, inline: true },
      { name: 'User Amount', value: `${userCount}`, inline: true },
      { name: 'Uptime', value: `${uptime}` },
      { name: 'Command Amount', value: `${commandCount.normalAmount}`, inline: true },
      { name: 'Subcommand Amount', value: `${commandCount.subcommandsAmount}`, inline: true }
    )
}

function getBotUptime(interaction: ChatInputCommandInteraction): string {
  const seconds = Math.floor(interaction.client.uptime / 1000)
  const currentSeconds = Math.floor(Date.now() / 1000);
  const epochSeconds = currentSeconds - seconds;
  
  return `<t:${epochSeconds}:f>`;
}

async function getCommandCount(interaction: ChatInputCommandInteraction): Promise<{
  normalAmount: number,
  subcommandsAmount: number
}> {
  const commands = await interaction.client.application?.commands.fetch()
  const normalAmount = commands.size
  
  let subcommandsAmount = 0
  for (const command of commands) {
    for (const subcommand of command) subcommandsAmount++
  }
  
  return { normalAmount, subcommandsAmount }
}