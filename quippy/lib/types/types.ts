import {
  ChatInputCommandInteraction,
  Message
} from "discord.js";

export interface EmbedEditPayload {
  interaction: ChatInputCommandInteraction,
  message: Message
};