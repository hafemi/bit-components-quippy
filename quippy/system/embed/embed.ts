
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
  let field1Content = '';
  let field2Content = '';
  
  for (const key in EmbedBuilderLimitations) {
    if (isNaN(Number(key[0]))) {
      field1Content += `${key}\n`;
      field2Content += `${EmbedBuilderLimitations[key as keyof typeof EmbedBuilderLimitations]}\n`;
    }
  }

  return new EmbedBuilder()
    .setColor(defaultEmbedColor)
    .setTitle('EmbedBuilder Limitations')
    .setDescription(`
      » Numbers represent amount of characters or different fields allowed.
      » Amount can not be exceeded due to Discord\'s API limitations.
    `)
    .addFields(
      { name: 'Field', value: field1Content, inline: true },
      { name: 'Limit', value: field2Content, inline: true }
    );
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