
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
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

const actionRows = create5x5ButtonActionRows([
  createButton({
    id: EmbedBuilderButtonID.SetTitle,
    label: 'Set Title',
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
  let hasOneSuccess: boolean = false
  
  if (title || url) hasOneSuccess = true;
  
  if (title) newEmbed.setTitle(title);
  if (url) {
    const isValidURL = validateEmbedURL(url);
    if (isValidURL) newEmbed.setURL(url);
    else if (!hasOneError) {
      hasOneError = 'Invalid Title URL';
    }
  }

  await updateEmbedAndSendReply({ interaction, message, newEmbed, hasOneError, hasOneSuccess });
}

function validateEmbedURL(url: string): boolean {
  try {
    new EmbedBuilder()
      .setDescription(null)
      .setURL(url);
    
    return true;
  } catch {
    return false
  }
}

async function updateEmbedAndSendReply({
  interaction,
  message,
  newEmbed,
  hasOneError,
  hasOneSuccess
}: {
  interaction: ModalSubmitInteraction,
  message: Message<boolean>,
  newEmbed: EmbedBuilder,
  hasOneError: string | undefined,
  hasOneSuccess: boolean
  }): Promise<void> {
  if (hasOneError) {
    await InteractionHelper.followUp(interaction, `\`Error:\` ${hasOneError}`);
  } else if (!hasOneSuccess) {
    await InteractionHelper.followUp(interaction, '`Info:` No changes made');
  } else {
    await message.edit({ embeds: [newEmbed] });
    await InteractionHelper.followUp(interaction, '`Success:` Embed updated');
  }
}