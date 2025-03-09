
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
import { fetchMessageById } from "@hafemi/quippy.lib.utils";

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

export async function handleEmbedExport(interaction: ChatInputCommandInteraction, messageId: string): Promise<string | undefined> {
  const message = await fetchMessageById({ channel: interaction.channel, messageId });
  
  if (!message) return `\`Error:\` Message with ID \`${messageId}\` not found`;
  if (!message.embeds.length) return `\`Error:\` Message with ID \`${messageId}\` has no embeds`;
  
  await sendEmbedDataAsAttachment(interaction, message.embeds);
}
  
async function sendEmbedDataAsAttachment(interaction: ChatInputCommandInteraction, embeds: Embed[]): Promise<void> {
  const embedString = JSON.stringify(embeds, null, 2);
  const attachment = createAttachmentFromString(embedString, 'embeds.json');
  await InteractionHelper.followUp(interaction, { files: [attachment] });
}

export async function sendEmbedFromAttachmentData(interaction: ChatInputCommandInteraction, attachment: Attachment): Promise<string | undefined> {
  try {
    const attachmentContent = await getTextFromAttachment(attachment);
    const embeds = JSON.parse(attachmentContent);
    await interaction.channel.send({ embeds });

  } catch (err) {
    switch (true) {
      case err.message.includes('not valid JSON'): return '`Error:` Invalid JSON format in attachment';
      case err.message.includes('non-text type attachment'): return '`Error:` Attachment is not a text file';
      case err.message.includes('description[BASE_TYPE_REQUIRED]'): return '`Error:` Embed description is required';
      default: throw new Error(`\`Error:\` Something went wrong while sending the attachment ${err}`);
    }
  }
}