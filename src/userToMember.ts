import { User, GuildMember, Guild } from "discord.js";

/** COMMAND : userToMember
 * 
 * @description
 *   Converts a Discord User object to a Discord GuildMember object
 *   Equivalent to guild.member(UserResolvable);
 * 
 * @param { Client } client 
 * @param { User } user 
 * 
 * @returns { GuildMember | undefined } The found member or undefined if it couldn't find them
 * 
 */

export function userToMember(guild: Guild, user: User): GuildMember | null
{
    return guild.member(user);
}
