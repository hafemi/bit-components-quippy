
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  codeBlock,
  ColorResolvable,
  EmbedBuilder,
  ModalSubmitInteraction,
  TextChannel,
  TextInputStyle
} from "discord.js";

import {
  create5x5ButtonActionRows,
  createButton
} from '@cd/core.djs.components';
import {
  addInteraction,
  wrapperCreateAndRegisterModal
} from '@cd/core.djs.event.interaction-create';

import {
  EmbedBuilderButtonID,
  EmbedBuilderLimitations,
  EmbedBuilderModalID
} from '@hafemi/quippy.lib.types';

import * as InteractionHelper from "@cd/core.djs.interaction-helper";
import { defaultEmbedColor } from "@hafemi/quippy.lib.constants";
import { execute } from "@hafemi/quippy.bot.command.bot";

const actionRows = create5x5ButtonActionRows([
  createButton({
    id: EmbedBuilderButtonID.SetTitle,
    label: 'Set Title',
    style: ButtonStyle.Secondary,
  }),
  createButton({
    id: EmbedBuilderButtonID.SetColor,
    label: 'Set Color',
    style: ButtonStyle.Secondary,
  }),
  createButton({
    id: EmbedBuilderButtonID.SetAuthor,
    label: 'Set Author',
    style: ButtonStyle.Secondary,
  }),
  createButton({
    id: EmbedBuilderButtonID.SetDescription,
    label: 'Set Description',
    style: ButtonStyle.Secondary,
  }),
  createButton({
    id: EmbedBuilderButtonID.SetThumbnail,
    label: 'Set Thumbnail',
    style: ButtonStyle.Secondary,
  }),
  createButton({
    id: EmbedBuilderButtonID.SetImage,
    label: 'Set Image',
    style: ButtonStyle.Secondary,
  }),
  createButton({
    id: EmbedBuilderButtonID.SetFooter,
    label: 'Set Footer',
    style: ButtonStyle.Secondary,
  }),
  createButton({
    id: EmbedBuilderButtonID.SetTimestamp,
    label: 'Set Timestamp',
    style: ButtonStyle.Secondary,
  }),
  createButton({
    id: EmbedBuilderButtonID.AddField,
    label: 'Add Field',
    style: ButtonStyle.Secondary,
  }),
  createButton({
    id: EmbedBuilderButtonID.Cancel,
    label: 'Cancel',
    style: ButtonStyle.Danger,
  }),
  createButton({
    id: EmbedBuilderButtonID.Submit,
    label: 'Submit',
    style: ButtonStyle.Success,
  })
]);

export function getMessagePayload(): {
  emptyEmbed: EmbedBuilder,
  actionRows: ActionRowBuilder<ButtonBuilder>[];
} {
  const emptyEmbed = new EmbedBuilder()
    .setDescription('Edit me by clicking the buttons below');

  return { emptyEmbed, actionRows };
}

export function registerEmbedBuilderComponents(): void {
  addInteraction(EmbedBuilderButtonID.SetTitle, async (interaction: ButtonInteraction) => await executeButtonSetTitle(interaction));
  addInteraction(EmbedBuilderButtonID.SetColor, async (interaction: ButtonInteraction) => await executeButtonSetColor(interaction));
  addInteraction(EmbedBuilderButtonID.SetAuthor, async (interaction: ButtonInteraction) => await executeButtonSetAuthor(interaction));
  addInteraction(EmbedBuilderButtonID.SetDescription, async (interaction: ButtonInteraction) => await executeButtonSetDescription(interaction));
  addInteraction(EmbedBuilderButtonID.SetThumbnail, async (interaction: ButtonInteraction) => await executeButtonSetThumbnail(interaction));
  addInteraction(EmbedBuilderButtonID.SetImage, async (interaction: ButtonInteraction) => await executeButtonSetImage(interaction));
  addInteraction(EmbedBuilderButtonID.SetFooter, async (interaction: ButtonInteraction) => await executeButtonSetFooter(interaction));
  addInteraction(EmbedBuilderButtonID.SetTimestamp, async (interaction: ButtonInteraction) => await executeButtonSetTimestamp(interaction));
  addInteraction(EmbedBuilderButtonID.AddField, async (interaction: ButtonInteraction) => await executeButtonAddField(interaction));
  addInteraction(EmbedBuilderButtonID.Cancel, async (interaction: ButtonInteraction) => await executeButtonCancel(interaction));
  addInteraction(EmbedBuilderButtonID.Submit, async (interaction: ButtonInteraction) => await executeButtonSubmit(interaction));
}

async function executeButtonSetTitle(interaction: ButtonInteraction): Promise<void> {
  const modalIdSetTitle = EmbedBuilderModalID.SetTitle;

  const modalSetTitle = wrapperCreateAndRegisterModal({
    customId: modalIdSetTitle,
    title: 'Set Title',
    executeFunc: executeModalSetTitle,
    textInputFields: [
      {
        id: 'title',
        label: 'New Embed Title',
        placeholder: 'I\'m a fancy title',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.Title,
        required: false
      },
      {
        id: 'url',
        label: 'Title URL',
        placeholder: 'https://example.com',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.URL,
        required: false
      }
    ],
  });

  await interaction.showModal(modalSetTitle);
};

async function executeButtonSetColor(interaction: ButtonInteraction): Promise<void> {
  const modalIdSetColor = EmbedBuilderModalID.SetColor;

  const modalSetColor = wrapperCreateAndRegisterModal({
    customId: modalIdSetColor,
    title: 'Set Color',
    executeFunc: executeModalSetColor,
    textInputFields: [
      {
        id: 'color',
        label: 'New Embed Color',
        placeholder: '#FFFFFF',
        style: TextInputStyle.Short,
        required: false
      }
    ],
  });

  await interaction.showModal(modalSetColor);
}

async function executeButtonSetAuthor(interaction: ButtonInteraction): Promise<void> {
  const modalIdSetAuthor = EmbedBuilderModalID.SetAuthor;

  const modalSetAuthor = wrapperCreateAndRegisterModal({
    customId: modalIdSetAuthor,
    title: 'Set Author',
    executeFunc: executeModalSetAuthor,
    textInputFields: [
      {
        id: 'author_name',
        label: 'Author Name',
        placeholder: 'Quippy',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.AuthorName,
        required: false
      },
      {
        id: 'author_url',
        label: 'Author URL',
        placeholder: 'https://example.com',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.URL,
        required: false
      },
      {
        id: 'author_icon_url',
        label: 'Author Icon URL',
        placeholder: 'https://example.com/icon.png',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.URL,
        required: false
      }
    ],
  });

  await interaction.showModal(modalSetAuthor);
}

async function executeButtonSetDescription(interaction: ButtonInteraction): Promise<void> {
  const modalIdSetDescription = EmbedBuilderModalID.SetDescription;

  const modalSetDescription = wrapperCreateAndRegisterModal({
    customId: modalIdSetDescription,
    title: 'Set Description',
    executeFunc: executeModalSetDescription,
    textInputFields: [
      {
        id: 'description',
        label: 'New Embed Description',
        placeholder: 'I\'m a fancy description',
        style: TextInputStyle.Paragraph,
        maxLength: EmbedBuilderLimitations.Description,
        required: false
      }
    ],
  });

  await interaction.showModal(modalSetDescription);
}

async function executeButtonSetThumbnail(interaction: ButtonInteraction): Promise<void> {
  const modalIdSetThumbnail = EmbedBuilderModalID.SetThumbnail;
  
  const modalSetThumbnail = wrapperCreateAndRegisterModal({
    customId: modalIdSetThumbnail,
    title: 'Set Thumbnail',
    executeFunc: executeModalSetThumbnail,
    textInputFields: [
      {
        id: 'thumbnail_url',
        label: 'Thumbnail URL',
        placeholder: 'https://example.com/thumbnail.png',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.URL,
        required: false
      }
    ],
  });
  
  await interaction.showModal(modalSetThumbnail);
}

async function executeButtonSetImage(interaction: ButtonInteraction): Promise<void> {
  const modalIdSetImage = EmbedBuilderModalID.SetImage;
  
  const modalSetImage = wrapperCreateAndRegisterModal({
    customId: modalIdSetImage,
    title: 'Set Image',
    executeFunc: executeModalSetImage,
    textInputFields: [
      {
        id: 'image_url',
        label: 'Image URL',
        placeholder: 'https://example.com/image.png',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.URL,
        required: false
      }
    ],
  });
  
  await interaction.showModal(modalSetImage);
}

async function executeButtonSetFooter(interaction: ButtonInteraction): Promise<void> {
  const modalIdSetFooter = EmbedBuilderModalID.SetFooter;
  
  const modalSetFooter = wrapperCreateAndRegisterModal({
    customId: modalIdSetFooter,
    title: 'Set Footer',
    executeFunc: executeModalSetFooter,
    textInputFields: [
      {
        id: 'footer_text',
        label: 'Footer Text',
        placeholder: 'I\'m a fancy footer',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.FooterText,
        required: false
      },
      {
        id: 'footer_icon_url',
        label: 'Footer Icon URL',
        placeholder: 'https://example.com/icon.png',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.URL,
        required: false
      }
    ],
  });
  
  await interaction.showModal(modalSetFooter);
}

async function executeButtonSetTimestamp(interaction: ButtonInteraction): Promise<void> {
  const modalIdSetTimestamp = EmbedBuilderModalID.SetTimestamp;
  
  const modalSetTimestamp = wrapperCreateAndRegisterModal({
    customId: modalIdSetTimestamp,
    title: 'Set Timestamp',
    executeFunc: executeModalSetTimestamp,
    textInputFields: [
      {
        id: 'timestamp',
        label: 'Timestamp',
        placeholder: 'Type "null" to use default timestamp',
        style: TextInputStyle.Short,
        required: false
      }
    ],
  });

  await interaction.showModal(modalSetTimestamp);
}

async function executeButtonAddField(interaction: ButtonInteraction): Promise<void> {
  const modalIdAddField = EmbedBuilderModalID.AddField;

  const modalAddField = wrapperCreateAndRegisterModal({
    customId: modalIdAddField,
    title: 'Add Field',
    executeFunc: executeModalAddField,
    textInputFields: [
      {
        id: 'field_name',
        label: 'Field Name',
        placeholder: 'Field Name',
        style: TextInputStyle.Short,
        maxLength: EmbedBuilderLimitations.FieldName,
        required: true
      },
      {
        id: 'field_value',
        label: 'Field Value',
        placeholder: 'Field Value',
        style: TextInputStyle.Paragraph,
        maxLength: EmbedBuilderLimitations.FieldValue,
        required: true
      },
      {
        id: 'inline',
        label: 'Inline',
        placeholder: 'If you don\'t want it inline, leave this empty',
        style: TextInputStyle.Short,
        required: false
      }
    ],
  });

  await interaction.showModal(modalAddField);
}

async function executeButtonCancel(interaction: ButtonInteraction): Promise<void> {
  const modalIdCancel = EmbedBuilderModalID.Cancel;
  
  const modalCancel = wrapperCreateAndRegisterModal({
    customId: modalIdCancel,
    title: 'Cancel',
    executeFunc: executeModalCancel,
    textInputFields: [
      {
        id: 'cancel',
        label: 'Are you sure you want to cancel?',
        value: 'Click the buttons below to choose your decision',
        placeholder: 'Click the buttons below to choose your decision',
        style: TextInputStyle.Short,
        required: false,
      }
    ],
  });
  
  await interaction.showModal(modalCancel);
}

async function executeButtonSubmit(interaction: ButtonInteraction): Promise<void> {
  const modalIdSubmit = EmbedBuilderModalID.Submit;
  
  const modalSubmit = wrapperCreateAndRegisterModal({
    customId: modalIdSubmit,
    title: 'Submit',
    executeFunc: executeModalSubmit,
    textInputFields: [
      {
        id: 'username',
        label: 'Username',
        placeholder: 'Quippy',
        style: TextInputStyle.Short,
        required: false,
      },
      {
        id: 'avatar_url',
        label: 'Avatar URL',
        placeholder: 'https://example.com/avatar.png',
        style: TextInputStyle.Short,
        required: false,
      }
    ],
  });
  
  await interaction.showModal(modalSubmit);
}

async function executeModalSetTitle(
  interaction: ModalSubmitInteraction,
  {
    title,
    url
  }: {
    title?: string;
    url?: string;
  }): Promise<void> {

  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  const hasNoValues = !(title || url);
  
  let hasOneError: string | undefined;

  if (title) newEmbed.setTitle(title);

  if (url) {
    const isValidURL = validateEmbedURL(url);
    if (isValidURL) newEmbed.setURL(url)

    if (!isValidURL) hasOneError = `Invalid Title URL - \`${url}\``
    else undefined
  }

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
}

async function executeModalSetColor(
  interaction: ModalSubmitInteraction,
  { color }: { color?: string; }
): Promise<void> {
  
  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  const hasNoValues = !color;
  
  let hasOneError: string | undefined;

  if (color) {
    const colorResolvable = color as ColorResolvable;
    const isValidColor = validateEmbedColor(colorResolvable);

    if (isValidColor) newEmbed.setColor(colorResolvable)

    if (!isValidColor) hasOneError = `Invalid Color - \`${color}\``
    else undefined
  }

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
}

async function executeModalSetAuthor(
  interaction: ModalSubmitInteraction,
  {
    author_name,
    author_url,
    author_icon_url
  }: {
    author_name?: string;
    author_url?: string;
    author_icon_url?: string;
  }): Promise<void> {

  const oldEmbed = interaction.message.embeds[0];
  const url = author_url || oldEmbed.data.author?.url;
  const iconURL = author_icon_url || oldEmbed.data.author?.icon_url;
  const hasNoValues = !(author_name || author_url || author_icon_url);
  
  let newEmbed = new EmbedBuilder(oldEmbed);
  let hasOneError: string | undefined = undefined;

  if (author_name || url || iconURL) {
    const isValidURL = validateEmbedURL(url);
    const isValidIconURL = validateEmbedURL(iconURL);

    newEmbed.setAuthor({
      name: author_name || oldEmbed.data.author?.name,
      url: isValidURL ? url : undefined,
      iconURL: isValidIconURL ? iconURL : undefined
    });

    if (!isValidURL) hasOneError = `Invalid Author URL - \`${url}\``;
    else if (!isValidIconURL) hasOneError = `Invalid Author Icon URL - \`${iconURL}\``;
    else undefined
  }

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
}

async function executeModalSetDescription(
  interaction: ModalSubmitInteraction,
  { description }: { description?: string; }
): Promise<void> {
  
  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  const hasNoValues = !description;
  
  let hasOneError: string | undefined;
  
  if (description) newEmbed.setDescription(description);
  
  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
}

async function executeModalSetThumbnail(
  interaction: ModalSubmitInteraction,
  { thumbnail_url }: { thumbnail_url?: string; }
): Promise<void> {
  
  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  const hasNoValues = !thumbnail_url;
  
  let hasOneError: string | undefined;

  if (thumbnail_url) {
    const isValidURL = validateEmbedURL(thumbnail_url);
    if (isValidURL) newEmbed.setThumbnail(thumbnail_url);

    if (!isValidURL) hasOneError = `Invalid Thumbnail URL - \`${thumbnail_url}\``
    else undefined
  }

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
}

async function executeModalSetImage(
  interaction: ModalSubmitInteraction,
  { image_url }: { image_url?: string; }
): Promise<void> {
  
  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  const hasNoValues = !image_url;
  
  let hasOneError: string | undefined;

  if (image_url) {
    const isValidURL = validateEmbedURL(image_url);
    if (isValidURL) newEmbed.setImage(image_url);

    if (!isValidURL) hasOneError = `Invalid Image URL - \`${image_url}\``
    else undefined
  }

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
}

async function executeModalSetFooter(
  interaction: ModalSubmitInteraction,
  {
    footer_text,
    footer_icon_url
  }: {
    footer_text?: string;
    footer_icon_url?: string;
  }): Promise<void> {

  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  const hasNoValues = !(footer_text || footer_icon_url);
  const footerIconURL = footer_icon_url || oldEmbed.data.footer?.icon_url;
  
  let hasOneError: string | undefined;

  if (footer_text || footer_icon_url) {
    const isValidIconURL = validateEmbedURL(footerIconURL);

    newEmbed.setFooter({
      text: footer_text || oldEmbed.data.footer?.text,
      iconURL: isValidIconURL ? footerIconURL : undefined
    });

    if (!isValidIconURL) hasOneError = `Invalid Footer Icon URL - \`${footer_icon_url}\``;
    else undefined
  }

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
}

async function executeModalSetTimestamp(
  interaction: ModalSubmitInteraction,
  { timestamp }: { timestamp?: string; }
): Promise<void> {
  
  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  const hasNoValues = !timestamp;
  
  let hasOneError: string | undefined;

  if (timestamp) {
    if (timestamp.toLowerCase() == 'null') {
      newEmbed.setTimestamp();
    } else {
      const isValidTimestamp = new Date(timestamp).getTime() > 0;
      if (isValidTimestamp) newEmbed.setTimestamp(new Date(timestamp));

      if (!isValidTimestamp) hasOneError = `Invalid Timestamp - \`${timestamp}\``;
      else undefined;
    }
  }

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
}

async function executeModalAddField(
  interaction: ModalSubmitInteraction,
  {
    field_name,
    field_value,
    inline
  }: {
    field_name: string;
    field_value: string;
    inline?: string;
  }): Promise<void> {

  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  const inlineBool = inline ? true : false
  
  let hasOneError: string | undefined;
  
  if (newEmbed.data.fields.length >= EmbedBuilderLimitations.Fields) {
    const valuesUsed = codeBlock(`Name: ${field_name} \nValue: ${field_value}`)
    hasOneError = `exceeded the limit of ${EmbedBuilderLimitations.Fields} fields. \n${valuesUsed}`
  } else if (field_name && field_value) {
    newEmbed.addFields({
      name: field_name,
      value: field_value,
      inline: inlineBool
    });
  }

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues: false });
}

async function executeModalCancel(interaction: ModalSubmitInteraction): Promise<void> { 
  await interaction.message.delete()
  await InteractionHelper.followUp(interaction, '`Success:` Embed cancelled');
}

async function executeModalSubmit(
  interaction: ModalSubmitInteraction,
  {
    username,
    avatar_url
  }: {
    username?: string;
    avatar_url?: string;
  }): Promise<void> {

  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  
  let hasOneError: string | undefined;
  
  username = username || 'Quippy';

  if (username || avatar_url) {
    const isValidURL = validateEmbedURL(avatar_url);
    hasOneError = !isValidURL ? `Invalid Avatar URL - \`${avatar_url}\`` : undefined;
  }
  
  if (hasOneError) { 
    await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues: false });
    return;
  }
  
  if (username || avatar_url) {
    await sendEmbedViaWebhook({ interaction, embed: newEmbed, username: username, avatarURL: avatar_url });
    await interaction.message.delete();
  } else {
    await interaction.message.edit({ embeds: [newEmbed], components: [] });
  }
  
  await InteractionHelper.followUp(interaction, '`Success:` Embed submitted');
}

async function updateEmbedAndSendReply({
  interaction,
  newEmbed,
  hasOneError,
  hasNoValues
}: {
  interaction: ModalSubmitInteraction,
  newEmbed: EmbedBuilder,
  hasOneError: string | undefined,
  hasNoValues: boolean;
}): Promise<void> {
  if (hasOneError) {
    await InteractionHelper.followUp(interaction, `\`Error:\` ${hasOneError}`);
  } else if (hasNoValues) {
    await InteractionHelper.followUp(interaction, '`Info:` No changes made');
  } else {
    await interaction.message.edit({ embeds: [newEmbed] });
    await InteractionHelper.followUp(interaction, '`Success:` Embed updated');
  }
}

function validateEmbedURL(url: string): boolean {
  try {
    new EmbedBuilder()
      .setDescription(null)
      .setURL(url);

    return true;
  } catch {
    return false;
  }
}

function validateEmbedColor(color: ColorResolvable): boolean {
  try {
    new EmbedBuilder()
      .setDescription(null)
      .setColor(color);

    return true;
  } catch {
    return false;
  }
}

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

async function sendEmbedViaWebhook({
  interaction,
  embed,
  username,
  avatarURL
}: {
  interaction: ModalSubmitInteraction
  embed: EmbedBuilder,
  username: string,
  avatarURL: string
  }): Promise<void> {
  const textChannel = interaction.channel as TextChannel;
  const webhook = await textChannel.createWebhook({
    name: username,
    avatar: avatarURL
  });

  await webhook.send({ embeds: [embed] });
  await webhook.delete();
}