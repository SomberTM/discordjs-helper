import { Guild } from 'discord.js'

//type
import { DiscordChannel } from './utils/DiscordChannel';


import { getChannel } from './utils/getChannel'

/** COMMAND : findChannel
 * 
 * @description
 *   Returns a channel from a guild by its id or name
 * 
 * @param { string } access -> how you are getting a channel i.e. 'id' or 'name'
 * @param { Guild } guild -> the guild you want to search for a channel in. Must be discord.js guild object i.e. message.guild etc...
 * @param { string } query -> either the id or the name of the channel. Should be based off of what you put in as the access paramater
 * @param { function } cb -> optional callback if you choose this route otherwise it will just return the channel found
 * 
 * @return { GuildChannel | undefined } found channel
 * 
 */

export function findChannel(access: string, guild: Guild, query: string, cb?: (channel: DiscordChannel | undefined) => void): DiscordChannel | undefined
{
    let found: DiscordChannel | undefined = getChannel(access, guild, query);
    if (!cb || cb == undefined) {
        return found;
    } else {
        cb(found);
    }
}