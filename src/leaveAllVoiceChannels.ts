import { Collection, Snowflake, Guild } from "discord.js";

/** COMMAND : leaveAllVoiceChannels
 *
 * @description
 *   Checks if the client is connected to a voice channel in each and guild and if so it will disconnect itself 
 * 
 * @param { Collection<Snowflake, Guild> } guilds The cache of all the guilds a client is apart of. Can be easily accessed through message.client.guilds.cache or simply client.guilds.cache
 * 
 */

export function leaveAllVoiceChannels(guilds: Collection<Snowflake, Guild>)
{
    [...guilds.values()].forEach((guild: Guild) => {
        if (guild.voice?.channel || guild.voice?.connection) { guild.voice.connection?.disconnect(); }
    });
}