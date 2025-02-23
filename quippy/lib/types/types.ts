import {
  EmbedBuilder
 } from "discord.js";

// ███████╗███╗░░░███╗██████╗░███████╗██████╗░██████╗░██╗░░░██╗██╗██╗░░░░░██████╗░███████╗██████╗░
// ██╔════╝████╗░████║██╔══██╗██╔════╝██╔══██╗██╔══██╗██║░░░██║██║██║░░░░░██╔══██╗██╔════╝██╔══██╗
// █████╗░░██╔████╔██║██████╦╝█████╗░░██║░░██║██████╦╝██║░░░██║██║██║░░░░░██║░░██║█████╗░░██████╔╝
// ██╔══╝░░██║╚██╔╝██║██╔══██╗██╔══╝░░██║░░██║██╔══██╗██║░░░██║██║██║░░░░░██║░░██║██╔══╝░░██╔══██╗
// ███████╗██║░╚═╝░██║██████╦╝███████╗██████╔╝██████╦╝╚██████╔╝██║███████╗██████╔╝███████╗██║░░██║
// ╚══════╝╚═╝░░░░░╚═╝╚═════╝░╚══════╝╚═════╝░╚═════╝░░╚═════╝░╚═╝╚══════╝╚═════╝░╚══════╝╚═╝░░╚═╝
// EmbedBuilder

export enum EmbedBuilderButtonID {
  SetTitle = 'embed_builder_button;set_title',
  SetColor = 'embed_builder_button;set_color',
  SetAuthor = 'embed_builder_button;set_author',
  SetDescription = 'embed_builder_button;set_description',
  SetThumbnail = 'embed_builder_button;set_thumbnail',
  SetImage = 'embed_builder_button;set_image',
  SetFooter = 'embed_builder_button;set_footer',
  SetTimestamp = 'embed_builder_button;set_timestamp',
  AddField = 'embed_builder_button;add_field',
}

export enum EmbedBuilderModalID {
  SetTitle = 'embed_builder_modal;set_title',
  SetColor = 'embed_builder_modal;set_color',
  SetAuthor = 'embed_builder_modal;set_author',
  SetDescription = 'embed_builder_modal;set_description',
  SetThumbnail = 'embed_builder_modal;set_thumbnail',
  SetImage = 'embed_builder_modal;set_image',
  SetFooter = 'embed_builder_modal;set_footer',
  SetTimestamp = 'embed_builder_modal;set_timestamp',
  AddField = 'embed_builder_modal;add_field',
}

export enum EmbedBuilderLimitations {
  Title = 256,
  Description = 4000,
  Fields = 25,
  FieldName = 256,
  FieldValue = 1024,
  FooterText = 2048,
  AuthorName = 256,
  EmbedCharacters = 6000,
  URL = 2048
}

export type SetAuthorPayload = {
  newEmbed: EmbedBuilder;
  hasOneError: string | undefined 
  url: string
  iconURL: string
}