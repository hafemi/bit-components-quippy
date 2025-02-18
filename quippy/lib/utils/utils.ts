import {
  Collection,
  Message,
  Snowflake,
  TextBasedChannel
} from 'discord.js';

export async function fetchMessages(channel: TextBasedChannel, amount: number): Promise<Collection<Snowflake, Message>> {
  const safeAmount = Math.max(Math.min(amount, 100), 1);
  const fetchedMessages = await channel.messages.fetch({ limit: safeAmount, cache: false });

  if (amount > 100) {
    let moreMessagesToFetch = amount - 100;
    let lastMessageId = fetchedMessages.last()?.id;

    while (moreMessagesToFetch > 0) {
      const nextBatchSize = Math.min(moreMessagesToFetch, 100);
      const additionalMessages = await channel.messages.fetch({ limit: nextBatchSize, before: lastMessageId });
      moreMessagesToFetch -= nextBatchSize;

      if (additionalMessages.size === 0) {
        break;
      }

      for (const [messageId, message] of additionalMessages.entries()) {
        fetchedMessages.set(messageId, message);
      }

      lastMessageId = additionalMessages.last()?.id;
    }
  }
  
  return fetchedMessages.reverse()
}