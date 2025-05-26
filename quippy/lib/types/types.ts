import {
  ChatInputCommandInteraction,
  EmbedBuilder
} from "discord.js";


// ░██████╗░███████╗███╗░░██╗███████╗██████╗░░█████╗░██╗░░░░░
// ██╔════╝░██╔════╝████╗░██║██╔════╝██╔══██╗██╔══██╗██║░░░░░
// ██║░░██╗░█████╗░░██╔██╗██║█████╗░░██████╔╝███████║██║░░░░░
// ██║░░╚██╗██╔══╝░░██║╚████║██╔══╝░░██╔══██╗██╔══██║██║░░░░░
// ╚██████╔╝███████╗██║░╚███║███████╗██║░░██║██║░░██║███████╗
// ░╚═════╝░╚══════╝╚═╝░░╚══╝╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝
// General

export enum EmbedColor {
  Default = '#5864f3',
  TicketSystem = '#5763f6',
  Log = '#eaff2e',
}

export enum LinkType {
  GitHubRepository = 'https://github.com/hafemi/bit-components-quippy',
  GitHubCommands = 'https://github.com/hafemi/bit-components-quippy/blob/master/README.md',
  DiscordHelpServer = 'https://discord.gg/ae82fnA53z',
}

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
  SetContent = 'embed_builder_button;set_content',
  AddField = 'embed_builder_button;add_field',
  Cancel = 'embed_builder_button;cancel',
  Submit = 'embed_builder_button;submit',
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
  SetContent = 'embed_builder_modal;set_content',
  AddField = 'embed_builder_modal;add_field',
  Cancel = 'embed_builder_modal;cancel',
  Submit = 'embed_builder_modal;submit',
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
  URL = 2048,
  Content = 2000,
}

export type SetAuthorPayload = {
  newEmbed: EmbedBuilder;
  hasOneError: string | undefined;
  url: string;
  iconURL: string;
};

// ████████╗██╗░█████╗░██╗░░██╗███████╗████████╗░██████╗██╗░░░██╗░██████╗████████╗███████╗███╗░░░███╗
// ╚══██╔══╝██║██╔══██╗██║░██╔╝██╔════╝╚══██╔══╝██╔════╝╚██╗░██╔╝██╔════╝╚══██╔══╝██╔════╝████╗░████║
// ░░░██║░░░██║██║░░╚═╝█████═╝░█████╗░░░░░██║░░░╚█████╗░░╚████╔╝░╚█████╗░░░░██║░░░█████╗░░██╔████╔██║
// ░░░██║░░░██║██║░░██╗██╔═██╗░██╔══╝░░░░░██║░░░░╚═══██╗░░╚██╔╝░░░╚═══██╗░░░██║░░░██╔══╝░░██║╚██╔╝██║
// ░░░██║░░░██║╚█████╔╝██║░╚██╗███████╗░░░██║░░░██████╔╝░░░██║░░░██████╔╝░░░██║░░░███████╗██║░╚═╝░██║
// ░░░╚═╝░░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝░░░╚═╝░░░╚═════╝░░░░╚═╝░░░╚═════╝░░░░╚═╝░░░╚══════╝╚═╝░░░░░╚═╝
// Ticket System

export enum TicketSystemLimitations {
  DifferentTypes = 5,
  Name = 200,
  Prefix = 15,
  CreationButton = 80
}

export type TicketSystemButtonCreateTicketPayload = {
  interaction: ChatInputCommandInteraction;
  type: string;
  title: string;
  description: string;
  buttonColor: string;
  buttonText: string;
  guildID: string;
};

export enum TicketSystemIDs {
  CreationButton = 'ticket_system;creation_button'
}

export type TicketTypeModalInformation = {
  title: string;
};

export type EditButtonType = 'enable' | 'disable';
export type ThreadUserAction = 'add' | 'remove';


// ░██████╗███████╗██████╗░██╗░░░██╗███████╗██████╗░░█████╗░░█████╗░███╗░░██╗███████╗██╗░██████╗░
// ██╔════╝██╔════╝██╔══██╗██║░░░██║██╔════╝██╔══██╗██╔══██╗██╔══██╗████╗░██║██╔════╝██║██╔════╝░
// ╚█████╗░█████╗░░██████╔╝╚██╗░██╔╝█████╗░░██████╔╝██║░░╚═╝██║░░██║██╔██╗██║█████╗░░██║██║░░██╗░
// ░╚═══██╗██╔══╝░░██╔══██╗░╚████╔╝░██╔══╝░░██╔══██╗██║░░██╗██║░░██║██║╚████║██╔══╝░░██║██║░░╚██╗
// ██████╔╝███████╗██║░░██║░░╚██╔╝░░███████╗██║░░██║╚█████╔╝╚█████╔╝██║░╚███║██║░░░░░██║╚██████╔╝
// ╚═════╝░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝░╚════╝░░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝░╚═════╝░
// Server Configuration & Logging

export type ConfigEditPayload = {
  interaction: ChatInputCommandInteraction
  value: string
  serverConfig: IServerConfig
};

export interface IServerConfig {
  uuid: string;
  guildId: string;
  channelIds: Partial<DatabaseChannelIds>;
  
  save: () => Promise<IServerConfig>;
}

export interface DatabaseChannelIds {
  logChannel: string;
}

export type ConfigChannelType = {
  logChannel: string;
};

export enum LoggingType {
  TicketCreated = 'Ticket Created',
  TicketClosed = 'Ticket Closed',
  UserAddedToTicket = 'User Added To Ticket',
  UserRemovedFromTicket = 'User Removed From Ticket'
}