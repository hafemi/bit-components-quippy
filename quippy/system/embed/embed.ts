
import {
  Attachment,
  channelMention,
  ChatInputCommandInteraction,
  Embed,
  EmbedBuilder,
  roleMention,
  userMention
} from "discord.js";

import {
  EmbedBuilderLimitations
} from '@hafemi/quippy.lib.types';

import {
  createAttachmentFromString,
  getTextFromAttachment
} from "@cd/core.djs.attachment";
import { defaultEmbedColor } from "@hafemi/quippy.lib.constants";

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

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
      return channelMention(id);
    case 'role':
      return roleMention(id);
  }
}

export async function sendEmbedDataAsAttachment(interaction: ChatInputCommandInteraction, embeds: Embed[]): Promise<void> {
  const embedString = JSON.stringify(embeds, null, 2);
  const attachment = createAttachmentFromString(embedString, 'embeds.json');
  await InteractionHelper.followUp(interaction, { files: [attachment] });
}

export async function sendEmbedFromAttachmentData(interaction: ChatInputCommandInteraction, attachment: Attachment): Promise<string | undefined> {
  const attachmentContent = await getTextFromAttachment(attachment);
  try {
    const embeds = JSON.parse(attachmentContent);
    await interaction.channel.send({ embeds });

  } catch (err) {
    if (err.message.includes('not valid JSON')) {
      return '`Error:` Invalid JSON format in attachment';
    }
    throw new Error(`\`Error:\` Something went wrong while sending the attachment ${err}`);
  }
}