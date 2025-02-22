
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
  Message,
  ModalSubmitInteraction,
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
  EmbedBuilderModalID,
  EmbedBuilderLimitations,
  SetAuthorPayload
} from '@hafemi/quippy.lib.types';

import * as InteractionHelper from "@cd/core.djs.interaction-helper";
import { defaultEmbedColor } from "@hafemi/quippy.lib.constants";

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

async function executeModalSetTitle(
  interaction: ModalSubmitInteraction,
  {
    title,
    url
  }: {
    title?: string;
    url?: string;
  }): Promise<void> {
  const message = interaction.message;
  const oldEmbed = message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  let hasOneError: string | undefined = undefined;
  let hasNoValues: boolean = true;

  if (title || url) hasNoValues = false;

  if (title) newEmbed.setTitle(title);
  if (url) {
    const isValidURL = validateEmbedURL(url);
    if (isValidURL) newEmbed.setURL(url);
    else if (!hasOneError) {
      hasOneError = 'Invalid Title URL';
    }
  }

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
}

async function executeModalSetColor(
  interaction: ModalSubmitInteraction,
  { color }: { color?: string; }
): Promise<void> {
  const oldEmbed = interaction.message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed);
  let hasOneError: string | undefined = undefined;
  let hasNoValues: boolean = true;

  if (color) hasNoValues = false;

  if (color) {
    const isValidColor = validateEmbedColor(color as ColorResolvable);
    if (isValidColor) newEmbed.setColor(color as ColorResolvable);
    else if (!hasOneError) hasOneError = `Invalid Color (${color})`;
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
  let newEmbed = new EmbedBuilder(oldEmbed);
  let hasOneError: string | undefined = undefined;
  let hasNoValues: boolean = true;

  if (author_name || author_url || author_icon_url) hasNoValues = false;

  if (author_name) newEmbed.setAuthor({ name: author_name });

  const authorURLPayload = addAuthorURLToEmbed({ newEmbed, hasOneError, url, iconURL });
  newEmbed = authorURLPayload.newEmbed;
  hasOneError = authorURLPayload.hasOneError;

  const authorIconURLPayload = addAuthorURLToEmbed({ newEmbed, hasOneError, url, iconURL });
  newEmbed = authorIconURLPayload.newEmbed;
  hasOneError = authorIconURLPayload.hasOneError;

  await updateEmbedAndSendReply({ interaction, newEmbed, hasOneError, hasNoValues });
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

function addAuthorURLToEmbed({
  newEmbed,
  hasOneError,
  url,
  iconURL,
}: SetAuthorPayload): {
  newEmbed: EmbedBuilder,
  hasOneError: string | undefined;
} {
  if (url) {
    const isValidURL = validateEmbedURL(url);
    if (isValidURL) newEmbed.setAuthor({
      name: newEmbed.data.author?.name,
      url,
      iconURL
    });
    else if (!hasOneError) {
      if (url) hasOneError = 'Invalid Author URL';
      else if (iconURL) 'Invalid Author Icon URL';
    }
  }

  return { newEmbed, hasOneError };
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