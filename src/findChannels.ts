import { GuildChannel, Guild } from 'discord.js'

import { DiscordChannel } from './utils/DiscordChannel';

import { getChannel } from './utils/getChannel'

/** COMMAND : findChannel
 * 
 * @description
 *   Returns channels from a guild by its id or name
 * 
 * @param { string } access -> how you are getting the channels i.e. 'id' or 'name'
 * @param { Guild } guild -> the guild you want to search for channels in. Must be discord.js guild object i.e. message.guild etc...
 * @param { string[] } query -> either the id or the name of the channels. Should be based off of what you put in as the access paramater
 * @param { function } cb -> optional callback if you choose this route otherwise it will just return the channels found
 * 
 * @return { GuildChannel[] | undefined } found channels
 * 
 */
export function findChannel(access: string, guild: Guild, query: string[], cb?: (channel: Array<DiscordChannel | undefined>) => void): Array<DiscordChannel | undefined>
{
    let found: Array<DiscordChannel | undefined> = [];

    query.forEach((value: string) => {
        let channel: DiscordChannel | undefined = getChannel(access, guild, value);
        found.push(channel);
    })

    if (!cb || cb == undefined) {
        return found;
    } else {
        cb(found);
    }

    return [undefined];
}