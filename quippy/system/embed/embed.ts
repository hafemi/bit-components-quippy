
import {
  ColorResolvable,
  EmbedBuilder,
  GuildTextBasedChannel,
  Message,
} from "discord.js";

import {
  defaultEmbedColor,
  embedEditMaxMessagesToFetch
} from '@hafemi/quippy.lib.constants';

import {
  fetchMessages
} from '@hafemi/quippy.lib.utils';

import {
  EmbedEditPayload
} from '@hafemi/quippy.lib.types';

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

export function getEmptyEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(defaultEmbedColor)
    .setDescription('This is an empty embed');
}

export async function getLatestMessageWithEmbed(channel: GuildTextBasedChannel): Promise<Message<boolean> | undefined> {
  const fetchedMessages = await fetchMessages(channel, embedEditMaxMessagesToFetch);
  const messagesWithEmbed = fetchedMessages
    .filter(message => message.embeds.length > 0)
    .map(message => message);

  if (messagesWithEmbed.length == 0) {
    return;
  } else {
    return messagesWithEmbed[0];
  }
}

export function validateEmbedColor(color: ColorResolvable): boolean {
  try {
    new EmbedBuilder()
      .setColor(color)
      .setDescription(null);

    return true;
  } catch (err) {
    return false;
  }
}

export async function editColorOfEmbed({
  interaction,
  message
}: EmbedEditPayload, color: ColorResolvable): Promise<void> {
  const oldEmbed = message.embeds[0];
  const embed = new EmbedBuilder(oldEmbed)
    .setColor(color);

  message.edit({ embeds: [embed] });

  await InteractionHelper.followUp(interaction, '> `Success:` edited color of latest embed', true);
}