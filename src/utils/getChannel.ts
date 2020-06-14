import { Guild, GuildChannel, TextChannel, VoiceChannel, NewsChannel, StoreChannel, CategoryChannel } from 'discord.js'

import { DiscordChannel } from './DiscordChannel';

import { isID } from './isID'

export function getChannel(access: string, guild: Guild, query: string): DiscordChannel | undefined
{
    switch( access.toLowerCase() )
    {
        case 'id':
            return isID(query) ? guild.channels.cache.find((channel: GuildChannel) => channel.id == query) as DiscordChannel : undefined;

        case 'name':
            return guild.channels.cache.find((channel: GuildChannel) => channel.name == query) as DiscordChannel;
    }
}