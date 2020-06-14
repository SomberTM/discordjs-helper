import { Role, Guild } from "discord.js";

import { getRole } from './utils/getRole';

/** COMMAND : findRole
 * 
 * @description
 *   Returns a role from a guild by its id or name
 * 
 * @param { string } access -> how you are getting a role i.e. 'id' or 'name'
 * @param { Guild } guild -> the guild you want to search for a role in. Must be discord.js guild object i.e. message.guild etc...
 * @param { string } query -> either the id or the name of the role. Should be based off of what you put in as the access paramater
 * @param { function } cb -> optional callback if you choose this route otherwise it will just return the role found
 * 
 * @return { Role | undefined } found role
 * 
 */

export function findRole(access: string, guild: Guild, query: string, cb?: (role: Role | undefined) => void): Role | undefined
{
    let found: Role | undefined = getRole(access, guild, query);
    if (!cb || cb == undefined) {
        return found;
    } else {
        cb(found);
    }
}

