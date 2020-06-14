import { TextChannel, VoiceChannel, NewsChannel, StoreChannel, CategoryChannel } from "discord.js";

export type DiscordChannel = TextChannel | VoiceChannel | NewsChannel | StoreChannel | CategoryChannel;