import { Role, Guild } from "discord.js";

import { getRole } from './utils/getRole';

/** COMMAND : findRoles
 * 
 * @description
 *   Returns multiple roles from a guild by its id or name
 * 
 * @param { string } access -> how you are getting a role i.e. 'id' or 'name'
 * @param { Guild } guild -> the guild you want to search for a role in. Must be discord.js guild object i.e. message.guild etc...
 * @param { string[] } query -> either the ids or the names of the roles. Should be based off of what you put in as the access paramater
 * @param { function } cb -> optional callback if you choose this route otherwise it will just return the roles found
 * 
 * @return { Role[] | undefined } found roles
 * 
 */

export function findRoles(access: string, guild: Guild, query: string[], cb?: (role: Array<Role | undefined>) => void): Array<Role | undefined>
{
    let found: Array<Role | undefined> = [];

    query.forEach((value: string) => {
        let role: Role | undefined = getRole(access, guild, value);
        found.push(role);
    })

    if (!cb || cb == undefined) {
        return found;
    } else {
        cb(found);
    }

    return [undefined];
}

