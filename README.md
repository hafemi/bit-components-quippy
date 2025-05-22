> This Bot does not have any invite links, yet.

# Commands
## Ticket System
Uses Threads & Type configurations to allow multiple different tickets.
### Type
- `/ticket type list` List all ticket types of this server
- `/ticket type add <name> <role> <prefix>` Add a ticket type
- `/ticket type remove <name>` Remove a ticket type
- `/ticket type edit <type> <newrole> <newprefix>` Edit a ticket type
### Standalone
- `/ticket transcript` Get a transcript of the ticket
- `/ticket close` Close the ticket
- `/ticket button create <type> <title> <description> <buttoncolor> <buttontext>` Send a button in the channel to create tickets
- `/ticket button disable <messageid>` Disable the buttons of a message
- `/ticket user add <user>` Add a user to a ticket
- `/ticket user remove <user>` Remove a user from a ticket

## Embed
Easy way to add simple embeds into your server. Avatar & Profile Picture are customizable when submitting the embed.
- `/embed create` Create a new Embed
- `/embed import <file>` Import an embed
- `/embed format <type> <id>` Get the API format for an ID
- `/embed export <id>` Export the embeds from a message
- `/embed limitations` View the limitations of the EmbedBuilder

## Bot
- `/bot info` View information about the bot
- `/bot statistics` View statistics about the bot
- `/bot latency` View the bot's current latency

## Server Configuration
Since this bot is entirely built via slash commands and not through a website we use this command to configurate important stuff.
- `/serverconfig edit <configuration> <value>` Edit a server configuration
- `/serverconfig list` List all server configurations
