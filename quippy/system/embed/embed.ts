
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
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
  EmbedBuilderModalID
} from '@hafemi/quippy.lib.types';

import * as InteractionHelper from "@cd/core.djs.interaction-helper";

const actionRows = create5x5ButtonActionRows([
  createButton({
    id: EmbedBuilderButtonID.SetTitle,
    label: 'Title',
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

async function executeButtonSetTitle (interaction: ButtonInteraction): Promise<void> {
  const modalIdSetTitle = EmbedBuilderModalID.SetTitle;

  const modalSetTitle = wrapperCreateAndRegisterModal({
    customId: modalIdSetTitle,
    title: 'Set Title',
    executeFunc: executeModalSetTitle,
    textInputFields: [
      {
        id: 'title',
        label: 'New Embed Title',
        style: TextInputStyle.Short,
        required: true,
      }
    ],
  });

  await interaction.showModal(modalSetTitle);
};

export async function executeModalSetTitle(interaction: ModalSubmitInteraction, inputs: { title: string; }) {
  const message = interaction.message;
  const oldEmbed = message.embeds[0];
  const newEmbed = new EmbedBuilder(oldEmbed)
    .setTitle(inputs.title);
  
  await message.edit({ embeds: [newEmbed] });
  await InteractionHelper.followUp(interaction, '`Success:` Title updated');
}