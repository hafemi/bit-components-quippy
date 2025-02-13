require('dotenv-safe').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const { log } = require('@cd/core.logger');
const ClientHelper = require('@cd/core.djs.client');
const { sendJSONToWebhook } = require('@cd/core.djs.webhook');
const { replacePlaceholders } = require('@cd/core.utils.string-transformer');

const ReadyEvent = require('@hafemi/quippy.bot.event.ready');

process
  .on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled Rejection: ' + reason, { promise: promise, reason: reason });
  })
  .on('uncaughtException', (error) => {
    log.error('Uncaught Exception thrown: ' + error.stack);

    if (error.message.includes('ECONNREFUSED')) {
      log.warn('Destroying client after fatal error..', { execute: 'client.destroy' });
      mainClient.destroy();
      log.warn('Client destroyed', { execute: 'client.destroy' });
      process.exit(1);
    }
  })
  .on('SIGINT', async function () {
    log.info('Shutting down forcefully..');
    
    const webHookUrl = process.env.LOGGER_DISCORD_WEBHOOK_URL;
    if (!webHookUrl) {
      log.warn('No webhook URL provided. Exiting..');
      process.exit(0);
    }

    await sendJSONToWebhook(
      JSON.parse(
        replacePlaceholders(process.env.DISCORD_EMBED_BOT_STOP ?? 'Bot shutting down...', {
          unixseconds: Math.floor(Date.now() / 1000),
        })
      ),
      webHookUrl
    ).catch((err) => log.error(err));

    process.exit(0);
  });

const mainClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel],
});

mainClient.login(process.env.DISCORD_BOT_TOKEN).catch((error) => log.error(error.stack));

const events = ['@hafemi/quippy.bot.event.ready'];

ClientHelper.loadEvents(mainClient, events).catch((err) => {
  log.error(err.stack, { execute: 'client.load_events', result: 'error', error: err });
  log.warn('Destroying client after fatal error..', { execute: 'client.destroy' });
  mainClient.destroy();
  log.warn('Client destroyed', { execute: 'client.destroy' });
});
