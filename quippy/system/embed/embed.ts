
import {
  channelMention,
  EmbedBuilder,
  roleMention,
  userMention
} from "discord.js";

import {
  EmbedBuilderLimitations
} from '@hafemi/quippy.lib.types';

import { defaultEmbedColor } from "@hafemi/quippy.lib.constants";

export function getLimitationsEmbed(): EmbedBuilder {
  const limitationString = Object.keys(EmbedBuilderLimitations)
    .filter(key => isNaN(Number(key[0]))) // Filter out numeric keys
    .map(key => `${key}: ${EmbedBuilderLimitations[key as keyof typeof EmbedBuilderLimitations]}`)
    .join('\n');

  return new EmbedBuilder()
    .setColor(defaultEmbedColor)
    .setTitle('EmbedBuilder Limitations')
    .setDescription(`
      » Numbers represent amount of characters or different fields allowed.
      » Amount can not be exceeded due to Discord\'s API limitations.
      
      ${limitationString}
    `);
}

export function getAPIFormatForID(type: string, id: string): string {
  switch (type) {
    case 'user':
      return userMention(id);
    case 'channel':
      return channelMention(id)
    case 'role':
      return roleMention(id)
  }
}