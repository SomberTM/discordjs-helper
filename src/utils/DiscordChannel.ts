import { TextChannel, VoiceChannel, NewsChannel, StoreChannel, CategoryChannel } from "discord.js";

/**
 * @typedef { type } DiscordChannel All channel types from discord.js except DMChannel 
 * Allows for specific typing in .ts files, for example you may want a TextChannel but a GuildChannel wont suffice so you can use DiscordChannel
 */
export type DiscordChannel = TextChannel | VoiceChannel | NewsChannel | StoreChannel | CategoryChannel;