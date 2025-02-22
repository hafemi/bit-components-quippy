
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
  EmbedBuilderLimitations
} from '@hafemi/quippy.lib.types';

import * as InteractionHelper from "@cd/core.djs.interaction-helper";
import { defaultEmbedColor } from "@hafemi/quippy.lib.constants";

const actionRows = create5x5ButtonActionRows([
  createButton({
    id: EmbedBuilderButtonID.SetTitle,
    label: 'Set Title',
    style: ButtonStyle.Primary,
  }),
  createButton({
    id: EmbedBuilderButtonID.SetColor,
    label: 'Set Color',
    style: ButtonStyle.Primary,
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

export async function executeModalSetTitle(
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
  const newEmbed = new EmbedBuilder(oldEmbed)
  let hasOneError: string | undefined = undefined;
  let hasNoValues: boolean = true
  
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

export async function executeModalSetColor(
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

async function updateEmbedAndSendReply({
  interaction,
  newEmbed,
  hasOneError,
  hasNoValues
}: {
  interaction: ModalSubmitInteraction,
  newEmbed: EmbedBuilder,
  hasOneError: string | undefined,
  hasNoValues: boolean
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

export function getLimitationsEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
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