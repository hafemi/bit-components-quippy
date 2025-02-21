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
}

export enum EmbedBuilderModalID {
  SetTitle = 'embed_builder_modal;set_title',
  SetColor = 'embed_builder_modal;set_color',
}

export enum EmbedBuilderLimitations {
  Title = 256,
  Description = 4096,
  Fields = 25,
  FieldName = 256,
  FieldValue = 1024,
  FooterText = 2048,
  AuthorName = 256,
  EmbedCharacters = 6000,
  URL = 2048
}