import { sequelize } from '@cd/core.database.sequelize.default-connection';
import * as ClientHelper from '@cd/core.djs.client';
import { sendJSONToWebhook } from '@cd/core.djs.webhook';
import { log } from '@cd/core.logger';
import { replacePlaceholders } from '@cd/core.utils.string-transformer';
import { registerEmbedBuilderComponents } from '@hafemi/quippy.system.embed-builder-create';
import { registerTicketSystemComponents } from '@hafemi/quippy.system.ticket-system.command';
import { Client, Events } from 'discord.js';

//Command modules
import '@hafemi/quippy.bot.command.bot';
import '@hafemi/quippy.bot.command.embed-builder';
import '@hafemi/quippy.bot.command.ticket-system';

export const name = Events.ClientReady;
export const once = true;

export async function execute(client: Client): Promise<any> {
  try {
    log.info('Logged in', { event: Events.ClientReady, clientUserId: client.user!.id, clientUserTag: client.user!.tag });

    log.verbose('Initialising Database connection');

    await sequelize.authenticate()
      .then(() => {
        log.info('Database connected');
      });

    const commands = [
      '@hafemi/quippy.bot.command.bot',
      '@hafemi/quippy.bot.command.embed-builder',
      '@hafemi/quippy.bot.command.ticket-system'
    ];

    await ClientHelper.deployCommands(client, process.env.DISCORD_BOT_TOKEN!, commands)
      .then(() => log.info('Global Commands deployed'));

    if (process.env.DISCORD_EMBED_BOT_START != null && process.env.WEBHOOK_URL_BOT_STATUS != null)
      await sendJSONToWebhook(JSON.parse(
        replacePlaceholders(process.env.DISCORD_EMBED_BOT_START, {
          unixseconds: Math.floor(Date.now() / 1000)
        })), process.env.WEBHOOK_URL_BOT_STATUS)
        .catch(err => log.error(err));
    
    registerEmbedBuilderComponents();
    registerTicketSystemComponents();

    log.warn('Ready!');
  } catch (err) {
    log.error(err.stack, { discordEvent: Events.ClientReady });
    log.warn('Destroying client after fatal error..');
    client.destroy();
    log.warn('Client destroyed')
  }
}